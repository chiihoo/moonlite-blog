import { IsOptional, IsString } from 'class-validator';

export class ArticlesGetDto {
  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  offset?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;
}
