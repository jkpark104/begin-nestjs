import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie; // eg. refreshToken=asdklfjdklf

        const refreshToken = cookie.replace('refreshToken=', '');

        return refreshToken;
      },
      secretOrKey: '나의리프레시비밀번호',
    });
    // 1. 비밀번호 검증
    // 2. 만료시간 검증
  }

  validate(payload) {
    return { id: payload.sub };
    // eg. req.user = { id: 1,  }
  }
}
