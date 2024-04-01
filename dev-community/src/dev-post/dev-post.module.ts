import { Module } from '@nestjs/common';
import { DevPostService } from './dev-post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DevPost, DevPostSchema } from 'src/schema/dev-post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DevPost.name, schema: DevPostSchema }
    ])],
  providers: [DevPostService]
})
export class DevPostModule {}
