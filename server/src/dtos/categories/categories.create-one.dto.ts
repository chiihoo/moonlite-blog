import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CategoriesCreateOneDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  parent_id: string | undefined;
}
