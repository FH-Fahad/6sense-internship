import { Module } from '@nestjs/common';
import { DevService } from './dev.service';
import { DevController } from './dev.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Dev, DevSchema } from 'src/schema/dev.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Dev.name,
      schema: DevSchema
    }]),
    JwtModule.register({
      secret: "mySecretKey",
      signOptions: { expiresIn: '1d' }
    })
  ],
  controllers: [DevController],
  providers: [DevService],
  // exports: [DevService]
})
export class DevModule { }
