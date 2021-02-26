import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { ILoginInfo } from 'src/interfaces';
import { AuthService } from './auth.service';

interface Ilogin {
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: Ilogin): Promise<ILoginInfo> {
    const { username, password } = body;
    const user = await this.authService.validateUser(username, password);
    if (user) {
      const data = await this.authService.signToken(user);
      return data;
    }
    throw new HttpException(
      {
        error: '用户名或密码错误',
      },
      401,
    );
  }
}
