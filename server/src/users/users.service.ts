import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersCreateOneDto, UsersGetOneDto } from 'src/dtos/users';
import { customAlphabet } from 'nanoid';
import * as bcrypt from 'bcryptjs';
import { IHttpData } from 'src/interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async findOneByUsername(
    username: string,
  ): Promise<IHttpData<UsersGetOneDto>> {
    const user = await this.usersRepository.findOne({ username });
    if (user) {
      const { password, ...data } = user;
      return { data };
    }
    return { error: { code: 404, message: '未找到该用户' } };
  }

  async createOne(dto: UsersCreateOneDto): Promise<IHttpData<any>> {
    const user = await this.usersRepository.findOne({ username: dto.username });
    if (user) {
      return { error: { code: 401, message: '用户名已存在' } };
    }
    const password = await bcrypt.hash(dto.password, 10);
    await this.usersRepository.save({
      ...dto,
      password,
      id: customAlphabet('1234567890', 16)(),
      createTime: new Date().getTime(),
    });
  }
}
