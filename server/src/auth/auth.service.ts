import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ILoginInfo, IValidatePassUser } from 'src/interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<IValidatePassUser | null> {
    const user = await this.usersRepository.findOne({ username });
    if (user) {
      let match = await bcrypt.compare(password, user.password);
      if (match) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async signToken(user: IValidatePassUser): Promise<ILoginInfo> {
    const payload = { id: user.id, username: user.username };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
