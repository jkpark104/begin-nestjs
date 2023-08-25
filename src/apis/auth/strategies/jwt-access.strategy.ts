import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// eg. import { KakaoStrategy } from 'passport-kakao';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      // jwtFromRequest: (req) => {
      //   const temp = req.headers.Authorization;

      //   const accessToken = temp.toLowercase().replace('bearer ', '');

      //   return accessToken;
      // },
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrkey: '나의비밀번호',
    });
    // 1. 비밀번호 검증
    // 2. 만료시간 검증
  }

  validate(payload) {
    return { id: payload.sub, username: payload.name };
    // eg. req.user = { id: 1, username: 'kimcoding' }
  }
}
