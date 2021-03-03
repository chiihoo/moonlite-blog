import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ArticlesCreateOneDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsString()
  content: string;
}
