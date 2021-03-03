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
  ArticlesCreateOneDto,
  ArticlesEditOneDto,
  ArticlesGetDto,
} from 'src/dtos/articles';
import { ArticlesService } from './articles.service';

@Controller('articles')
@UseGuards(AuthGuard('jwt'))
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get('/one')
  getArticleInfo(@Query('id') id: string) {
    return this.articlesService.getArticleInfo(id);
  }

  @Get()
  // limit:返回数量。offset:偏移数量，用于分页，默认为0。categoryId：分类的id
  getArticles(@Query() dto: ArticlesGetDto) {
    return this.articlesService.getArticles(dto);
  }

  @Post()
  createOne(@Body() dto: ArticlesCreateOneDto) {
    return this.articlesService.createOne(dto);
  }

  @Put()
  editOne(@Body() dto: ArticlesEditOneDto) {
    return this.articlesService.editOne(dto);
  }

  @Delete()
  deleteOne(@Query('id') id: string) {
    return this.articlesService.deleteOne(id);
  }
}
