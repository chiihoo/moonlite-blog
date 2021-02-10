import {
  IsByteLength,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class UsersCreateOneDto {
  @IsNotEmpty()
  @IsString()
  @IsByteLength(3, 16)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;

  // // @ValidateIf的参数返回true时，这一项中其余规则才会进行校验
  // @ValidateIf((e) => e.email !== '')
  // // @IsOptional()使=== null, === undefined时，忽视规则校验
  // @IsOptional()
  // @IsString()
  // @IsEmail()
  // email: string | null;

  // @IsOptional()
  // @IsString()
  // avatar: string | null;
}
