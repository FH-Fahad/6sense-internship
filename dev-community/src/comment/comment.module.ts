import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/schema/comment.schema';
import { PostModule } from 'src/post/post.module';
import { PostComment, PostCommentSchema } from 'src/schema/post-comment.schema';
import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from 'src/dev/jwt-strategy';

@Module({
  imports: [
    PostModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{
      name: Comment.name,
      schema: CommentSchema
    }]),
    MongooseModule.forFeature([{
      name: PostComment.name,
      schema: PostCommentSchema
    }])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule { }
