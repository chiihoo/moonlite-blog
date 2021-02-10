import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersCreateOneDto, UsersGetOneDto } from 'src/dtos/users';
import { IHttpData } from 'src/interfaces';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getUser(
    @Query('username') username: string,
  ): Promise<IHttpData<UsersGetOneDto>> {
    return this.usersService.findOneByUsername(username);
  }

  @Post()
  createOne(@Query() dto: UsersCreateOneDto): Promise<IHttpData<any>> {
    return this.usersService.createOne(dto);
  }
}
