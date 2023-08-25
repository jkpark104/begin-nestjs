import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
  imports: [JwtModule.register({}), UsersModule], // 모듈을 통해 불러오면 레포지토리를 공유할 수 있다.
  providers: [JwtAccessStrategy, AuthResolver, AuthService],
})
export class AuthModule {}
