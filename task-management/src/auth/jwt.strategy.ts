import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import env from 'src/config/app.config';
import { JwtPayload } from './jwt-payload.interface';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: JwtPayload) {
    const { username } = payload;

    const user = await this.authService.findOneByUsername(username);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
