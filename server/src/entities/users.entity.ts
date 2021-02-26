import {
  Column,
  CreateDateColumn,
  // CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  // PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UsersEntity {
  // @PrimaryGeneratedColumn('uuid')
  // id?: string;

  @PrimaryColumn({ unique: true })
  readonly id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email?: string | null;

  @Column({ nullable: true })
  avatar?: string | null;

  @CreateDateColumn()
  createDate?: Date;

  @UpdateDateColumn()
  updateDate?: Date;
}
