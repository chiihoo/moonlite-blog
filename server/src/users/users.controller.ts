import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersCreateOneDto, UsersGetOneDto } from 'src/dtos/users';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUser(@Query('username') username: string): Promise<UsersGetOneDto> {
    return this.usersService.findOneByUsername(username);
  }

  @Post()
  createOne(@Body() dto: UsersCreateOneDto) {
    return this.usersService.createOne(dto);
  }
}
