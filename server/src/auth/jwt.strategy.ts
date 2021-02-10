import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { IJwtInfo, IPayload } from 'src/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // 对于 JWT 策略，Passport 首先验证 JWT 的签名并解码 JSON 。然后调用我们的 validate() 方法，该方法将解码后的 JSON 作为其单个参数传递。
  // Passport 将基于 validate() 方法的返回值构建一个user 对象，并将其作为属性附加到请求对象上，req.user可以读到
  async validate(payload: IPayload): Promise<IJwtInfo> {
    return { id: payload.id, username: payload.username };
  }
}
