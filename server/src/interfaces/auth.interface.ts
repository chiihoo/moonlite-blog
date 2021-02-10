export interface IValidatePassUser {
  id: string;
  username: string;
  email?: string | null;
  avatar?: string | null;
  createTime: number;
}

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
