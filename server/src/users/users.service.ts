import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from 'src/entities';
import { UsersCreateOneDto, UsersGetOneDto } from 'src/dtos/users';
import { customAlphabet } from 'nanoid';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async findOneByUsername(username: string): Promise<UsersGetOneDto> {
    const user = await this.usersRepository.findOne({ username });
    if (user) {
      const { password, ...data } = user;
      return data;
    }
    throw new HttpException(
      {
        status: 404,
        error: '未找到该用户',
      },
      401,
    );
  }

  async createOne(dto: UsersCreateOneDto): Promise<void> {
    const user = await this.usersRepository.findOne({ username: dto.username });
    if (user) {
      throw new HttpException(
        {
          status: 401,
          error: '用户名已存在',
        },
        401,
      );
    }
    const password = await bcrypt.hash(dto.password, 10);
    await this.usersRepository.save({
      ...dto,
      password,
      id: customAlphabet('1234567890', 16)(),
    });
  }
}
