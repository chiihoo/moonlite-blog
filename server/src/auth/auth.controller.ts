import { Controller, Post, Query } from '@nestjs/common';
import { IHttpData, ILoginInfo } from 'src/interfaces';
import { AuthService } from './auth.service';

interface Ilogin {
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Query() query: Ilogin): Promise<IHttpData<ILoginInfo>> {
    const { username, password } = query;
    const user = await this.authService.validateUser(username, password);
    if (user) {
      const data = await this.authService.signToken(user);
      return { data };
    }
    return { error: { code: 401, message: '用户名或密码错误' } };
  }
}
