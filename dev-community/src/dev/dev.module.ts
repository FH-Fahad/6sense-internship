import { Module } from '@nestjs/common';
import { DevService } from './dev.service';
import { DevController } from './dev.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Dev, DevSchema } from 'src/schema/dev.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy';
import { loadEnv } from 'src/common/config/jwt-secret-loader.config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{
      name: Dev.name,
      schema: DevSchema
    }]),
    JwtModule.registerAsync({
      useFactory: async () => {
        await loadEnv();
        return {
          secret: process.env.JWT_SECRET
        }
      }
    })
  ],
  controllers: [DevController],
  providers: [DevService, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class DevModule { }
