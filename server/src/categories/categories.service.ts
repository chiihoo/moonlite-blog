import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CategoriesCreateOneDto,
  CategoriesEditOneDto,
  CategoriesIsNameVaildDto,
} from 'src/dtos/categories';
import { CategoriesEntity } from 'src/entities';
import { getManager, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private readonly categoriesRepository: Repository<CategoriesEntity>,
  ) {}

  // 检测分类名称是否可用，判断标准为同一级是否有相同名称
  async isNameVaild(dto: CategoriesIsNameVaildDto): Promise<boolean> {
    const treeRepository = getManager().getTreeRepository(CategoriesEntity);
    // parent_id为undefined时，则为存储在最上级分类，否则为子类
    if (!dto.parent_id) {
      // 是最上级分类
      const tree = await treeRepository.findTrees();
      return tree.every((item) => {
        return item.name !== dto.name;
      });
    } else {
      // 不是最上级分类
      // 找到对应父级实体
      const parentCategory = await treeRepository.findOne(dto.parent_id);
      if (!parentCategory) {
        throw new HttpException(
          {
            error: '该父类层级不存在',
          },
          404,
        );
      }
      //获取parentCategory的所有直接子类别（及其嵌套类别）
      const descendantsTree = await treeRepository.findDescendantsTree(
        parentCategory,
      );
      // descendantsTree.children即为该父级实体的所有子类（及嵌套），搜索同层级有没有相同名称
      return descendantsTree.children.every((item) => {
        return item.name !== dto.name;
      });
    }
  }

  // 创建一个category
  async createOne(dto: CategoriesCreateOneDto): Promise<void> {
    const treeRepository = getManager().getTreeRepository(CategoriesEntity);
    // parent_id为undefined时，则为存储在最上级分类，否则为子类
    if (!dto.parent_id) {
      const tree = await treeRepository.findTrees();
      const hasNotSame = tree.every((item) => {
        return item.name !== dto.name;
      });
      if (hasNotSame) {
        // 如果最上级分类没有相同名称，就存储
        const category = new CategoriesEntity();
        category.name = dto.name;
        await treeRepository.save(category);
      } else {
        throw new HttpException(
          {
            error: '该分类名在当前层级已存在',
          },
          404,
        );
      }
    } else {
      // 不是最上级分类
      // 找到对应父级实体
      const parentCategory = await treeRepository.findOne(dto.parent_id);
      if (!parentCategory) {
        throw new HttpException(
          {
            error: '该父类层级不存在',
          },
          404,
        );
      }
      //获取parentCategory的所有直接子类别（及其嵌套类别）
      const descendantsTree = await treeRepository.findDescendantsTree(
        parentCategory,
      );
      // descendantsTree.children即为该父级实体的所有子类（及嵌套），搜索同层级有没有相同名称
      const hasNotSame = descendantsTree.children.every((item) => {
        return item.name !== dto.name;
      });
      if (hasNotSame) {
        // 如果同层级没有相同名称，就存储
        const category = new CategoriesEntity();
        category.name = dto.name;
        category.parent = parentCategory;
        await treeRepository.save(category);
      } else {
        throw new HttpException(
          {
            error: '该分类名在当前层级已存在',
          },
          404,
        );
      }
    }
  }

  async editOne(dto: CategoriesEditOneDto) {
    const category = await this.categoriesRepository.findOne(dto.id);
    if (!category) {
      throw new HttpException(
        {
          error: '该分类不存在',
        },
        404,
      );
    }
    const treeRepository = getManager().getTreeRepository(CategoriesEntity);
    // 不是最上级分类
    if (dto.parent_id) {
      // 有可能传来的父元素id为它本身，则在它之下新建一个
      if (dto.id === dto.parent_id) {
        await this.createOne({ name: dto.name, parent_id: dto.id });
      } else {
        const parentCategory = await treeRepository.findOne(dto.parent_id);
        if (!parentCategory) {
          throw new HttpException(
            {
              error: '该父类层级不存在',
            },
            404,
          );
        }
        category.name = dto.name;
        category.parent = parentCategory;
        await treeRepository.save(category);
      }
    } else {
      // 是最上级分类
      category.name = dto.name;
      category.parent = null;
      await treeRepository.save(category);
    }
  }

  async deleteOne(id: string) {
    const category = await this.categoriesRepository.findOne(id);
    if (!category) {
      throw new HttpException(
        {
          error: '该分类不存在',
        },
        404,
      );
    }

    // https://github.com/typeorm/typeorm/issues/193
    // 目前typeorm针对嵌套集还没有做更新和删除功能，如果直接删会报错
    // 只能先删除树型结构的叶子结点，再一层层往上删除
    // const treeRepository = getManager().getTreeRepository(CategoriesEntity);
    // await treeRepository.remove(category)

    // 以下为替代方法：
    const treeRepository = getManager().getTreeRepository(CategoriesEntity);
    // 找到要删除的结点即它的子孙结点
    const childrensTree = await treeRepository.findDescendantsTree(category);
    // 用广度优先搜索，把childrensTree树形结构的每一层进行存储，再从下往上依次删除每层
    let res: CategoriesEntity[][] = [];
    let queue: CategoriesEntity[] = [];
    queue.push(childrensTree);
    while (queue.length > 0) {
      let len = queue.length;
      let temp: CategoriesEntity[] = [];
      while (len--) {
        let node = queue.shift();
        temp.push(node);
        if (node.children && node.children.length > 0) {
          node.children.forEach((item) => queue.push(item));
        }
      }
      // 把最下层放res的最前面
      res.unshift(temp);
    }
    // 进行删除
    for (let level of res) {
      await treeRepository.remove(level);
    }
  }

  // 获得categories的树结构
  async getTree(): Promise<CategoriesEntity[]> {
    const manager = getManager();
    const trees = await manager.getTreeRepository(CategoriesEntity).findTrees();
    return trees;
  }

  // 根据id找到单个categoriy信息
  async getCategoriesById(id: string): Promise<CategoriesEntity> {
    const category = await this.categoriesRepository.findOne(id);
    if (!category) {
      throw new HttpException(
        {
          error: '该分类不存在',
        },
        404,
      );
    }
    return category;
  }
}
