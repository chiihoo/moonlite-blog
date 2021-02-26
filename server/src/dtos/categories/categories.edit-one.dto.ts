import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CategoriesEditOneDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  parent_id: string | undefined;
}
