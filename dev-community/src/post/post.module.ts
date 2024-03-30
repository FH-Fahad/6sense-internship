import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/schema/post.schema';
import { DevModule } from 'src/dev/dev.module';

@Module({
  imports: [
    DevModule,
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema
      }
    ])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule { }
