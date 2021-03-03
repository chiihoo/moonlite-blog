import { Get, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { customAlphabet } from 'nanoid';
import {
  ArticlesCreateOneDto,
  ArticlesEditOneDto,
  ArticlesGetDto,
} from 'src/dtos/articles';
import { ArticlesEntity, CategoriesEntity } from 'src/entities';
import {
  createQueryBuilder,
  FindManyOptions,
  getConnection,
  Repository,
} from 'typeorm';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticlesEntity)
    private readonly articlesRepository: Repository<ArticlesEntity>,
  ) {}

  async getArticleInfo(id: string) {
    const article = this.articlesRepository.findOne(id);
    if (!article) {
      throw new HttpException(
        {
          error: '该文章不存在',
        },
        404,
      );
    }
    return article;
  }

  // 分页查询、并且可以根据分类id来查询
  async getArticles(dto: ArticlesGetDto) {
    // 每页最大的实体数
    const limit = dto.limit && dto.limit !== '0' ? +dto.limit : 30;
    // 偏移，0为第一页
    const offset = dto.offset ? +dto.offset : 0;

    // skip为跳过前skip个数据;
    // take为取前take个数据;
    // 所以skip和take组合就是跳过前skip个数据取take个数据;
    const skip = limit * offset;
    const take = limit;

    if (dto.categoryId) {
      // 根据分类进行查询
      // 左连接
      const data = await getConnection()
        .createQueryBuilder(ArticlesEntity, 'articles')
        .select([
          'articles.id',
          'articles.title',
          'articles.categoryId',
          'articles.coverUrl',
          'articles.createDate',
          'articles.updateDate',
        ])
        .where('articles.categoryId = :categoryId', {
          categoryId: dto.categoryId,
        })
        .orderBy('articles.createDate', 'DESC')
        .skip(skip)
        .take(take)
        .leftJoinAndMapOne(
          'articles.category',
          CategoriesEntity,
          'categories',
          'articles.categoryId=categories.id',
        )
        .getManyAndCount();
      return {
        articlesList: data[0],
        total: data[1],
      };
    } else {
      // 直接查询
      const data = await getConnection()
        .createQueryBuilder(ArticlesEntity, 'articles')
        .select([
          'articles.id',
          'articles.title',
          'articles.categoryId',
          'articles.coverUrl',
          'articles.createDate',
          'articles.updateDate',
        ])
        .orderBy('articles.createDate', 'DESC')
        .skip(skip)
        .take(take)
        .leftJoinAndMapOne(
          'articles.category',
          CategoriesEntity,
          'categories',
          'articles.categoryId=categories.id',
        )
        .getManyAndCount();
      return {
        articlesList: data[0],
        total: data[1],
      };
    }

    // leftJoin
    // SELECT * FROM articles LEFT JOIN categories ON articles.categoryId = categories.id
  }

  async createOne(dto: ArticlesCreateOneDto) {
    return this.articlesRepository.save({
      ...dto,
      id: customAlphabet('1234567890', 16)(),
    });
  }

  async editOne(dto: ArticlesEditOneDto) {
    const article = await this.articlesRepository.findOne(dto.id);
    if (!article) {
      throw new HttpException(
        {
          error: '该文章不存在',
        },
        404,
      );
    }

    article.title = dto.title || '';
    article.categoryId = dto.categoryId || '';
    article.coverUrl = dto.coverUrl || '';
    article.content = dto.content || '';
    return this.articlesRepository.save(article);
  }

  async deleteOne(id: string) {
    const article = await this.articlesRepository.findOne(id);
    if (!article) {
      throw new HttpException(
        {
          error: '该文章不存在',
        },
        404,
      );
    }
    return this.articlesRepository.remove(article);
  }
}
