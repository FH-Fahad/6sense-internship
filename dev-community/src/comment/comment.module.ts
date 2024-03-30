import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/schema/comment.schema';
import { DevModule } from 'src/dev/dev.module';

@Module({
  imports: [
    DevModule,
    MongooseModule.forFeature([{
      name: Comment.name,
      schema: CommentSchema
    }])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule { }
