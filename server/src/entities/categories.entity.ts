import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';

// https://typeorm.biunav.com/zh/tree-entities.html
@Entity({ name: 'categories' })
// @Tree("nested-set") // 嵌套集 会加parentId、nsLeft和nsRight列，读取非常有效，但不利于写入，且不能在嵌套集中有多个根
@Tree('materialized-path') // 物化路径模式（又叫路径枚举），会加mpath和parentId列
// @Tree('closure-table')  // 闭合表模式，会新建一个categories_closure表，表中有id_ancestor和id_descendant列
export class CategoriesEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @TreeParent()
  parent?: CategoriesEntity | null;

  @TreeChildren()
  children?: CategoriesEntity[] | null;

  @CreateDateColumn()
  createDate?: Date;

  @UpdateDateColumn()
  updateDate?: Date;
}
