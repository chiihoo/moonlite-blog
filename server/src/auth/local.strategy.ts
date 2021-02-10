import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ILocalInfo } from 'src/interfaces';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  // local策略在数据库中查找username，并比较password是否正确，如果确认成功，则返回不含密码的user信息
  // @UseGuards(AuthGuard('local'))，login(@Request() req){}，返回的user数据挂载在req上，用req.user读取
  async validate(username: string, password: string): Promise<ILocalInfo> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
