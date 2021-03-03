import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ArticlesEditOneDto {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
