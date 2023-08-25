import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import {
  IAuthServiceGetAccessToken,
  IAuthServiceLogin,
} from './interfaces/auth-service.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login({ email, password }: IAuthServiceLogin): Promise<string> {
    // 1. 이메일이 일치하는 사용자가 있는지 확인한다.
    const user = await this.usersService.findOneEmail({ email });

    // 2. 일치하는 유저가 없으면 에러를 발생시킨다.
    if (!user) {
      throw new UnprocessableEntityException(
        'There is no user with that email.',
      );
    }

    // 3. 비밀번호가 일치하는지 확인한다.
    const isAuthenticated = await bcrypt.compare(password, user.password);

    // 4. 비밀번호가 일치하지 않으면 에러를 발생시킨다.
    if (!isAuthenticated) {
      throw new UnprocessableEntityException('Password is incorrect.');
    }

    return this.getAccessToken({ user });
  }

  getAccessToken({ user }: IAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { sub: user.id },
      { secret: '나의비밀번호', expiresIn: '1h' },
    );
  }
}
