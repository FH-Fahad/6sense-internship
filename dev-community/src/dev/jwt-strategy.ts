import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { DevService } from "./dev.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        protected readonly devService: DevService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: `${process.env.JWT_SECRET}`
        });
    }

    async validate(payload) {
        const { id } = payload;

        const dev = await this.devService.findOne(id);

        if (!dev) {
            throw new UnauthorizedException();
        }
        return dev;
    }
}