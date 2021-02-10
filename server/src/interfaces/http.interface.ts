export interface IHttpData<T = any> {
  data?: T;
  error?: {
    code: number;
    message: string;
  };
}
