import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/schema/comment.schema';
import { PostComment, PostCommentSchema } from 'src/schema/post-comment.schema';
import { PassportModule } from '@nestjs/passport';
import { PostCommentService } from 'src/post-comment/post-comment.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{
      name: Comment.name,
      schema: CommentSchema
    }, {
      name: PostComment.name,
      schema: PostCommentSchema
    }
    ])],
  controllers: [CommentController],
  providers: [CommentService, PostCommentService],
})
export class CommentModule { }
