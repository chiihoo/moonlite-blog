import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  CategoriesCreateOneDto,
  CategoriesEditOneDto,
  CategoriesIsNameVaildDto,
} from 'src/dtos/categories';
import { CategoriesService } from './categories.service';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('/tree')
  getCategoriesTrees() {
    return this.categoriesService.getTree();
  }

  @Get()
  getCategoriesById(@Query('id') id: string) {
    return this.categoriesService.getCategoriesById(id);
  }

  @Post()
  createOne(@Body() dto: CategoriesCreateOneDto) {
    return this.categoriesService.createOne(dto);
  }

  @Put()
  editOne(@Body() dto: CategoriesEditOneDto) {
    return this.categoriesService.editOne(dto);
  }

  @Delete()
  deleteOne(@Query('id') id: string) {
    return this.categoriesService.deleteOne(id);
  }

  @Get('/isNameVaild')
  getIsNameVaild(@Query() dto: CategoriesIsNameVaildDto) {
    return this.categoriesService.isNameVaild(dto);
  }
}
