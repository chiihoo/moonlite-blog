import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'articles' })
export class ArticlesEntity {
  @PrimaryColumn({ unique: true })
  readonly id: string;

  @Column({ length: 50 })
  title: string;

  @Column({ nullable: true })
  categoryId: string | null;

  @Column({ nullable: true })
  coverUrl?: string | null;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createDate?: Date;

  @UpdateDateColumn()
  updateDate?: Date;
}
