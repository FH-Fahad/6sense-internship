import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevModule } from './dev/dev.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { PostCommentModule } from './post-comment/post-comment.module';
import { DevPostModule } from './dev-post/dev-post.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/dev-community'), DevModule, PostModule, CommentModule, PostCommentModule, DevPostModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
