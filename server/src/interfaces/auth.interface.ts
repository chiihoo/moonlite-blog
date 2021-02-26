// export interface IValidatePassUser {
//   id: string;
//   username: string;
//   email?: string | null;
//   avatar?: string | null;
//   createTime: number;
// }

import { UsersGetOneDto } from 'src/dtos/users';

// 从UsersGetOneDto去掉'password'属性
export type IValidatePassUser = Omit<UsersGetOneDto, 'password'>;

export interface IPayload {
  id: string;
  username: string;
}

export type IJwtInfo = IPayload;

export type ILocalInfo = IValidatePassUser;

export interface ILoginInfo {
  user: IValidatePassUser;
  access_token: string;
}
