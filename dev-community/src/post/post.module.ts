import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/schema/post.schema';
import { DevModule } from 'src/dev/dev.module';
import { DevPost, DevPostSchema } from 'src/schema/dev-post.schema';
import { DevPostService } from 'src/dev-post/dev-post.service';

@Module({
  imports: [
    DevModule,
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema
      },
      {
        name: DevPost.name,
        schema: DevPostSchema
      }
    ])
  ],
  controllers: [PostController],
  providers: [PostService, DevPostService],
})
export class PostModule { }
