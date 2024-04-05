import { Controller, Post, Body, UseGuards, Get, Patch, Delete, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Comment } from './entity/comment.Schema';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCurrentPostId } from 'src/common/decorators/get-user-id.decorator';
import Mongoose from 'mongoose';

@Controller('/comments')
@UseGuards(AuthGuard())
export class CommentController {
  constructor(private readonly commentService: CommentService,
  ) { }

  @Post('/:postId')
  create(@Body() createCommentDto: CreateCommentDto,
    @GetCurrentPostId() postId: Mongoose.Types.ObjectId): Promise<Comment> {
    return this.commentService.create(createCommentDto, postId);
  }

  @Get('/all/:postId')
  findAll(@GetCurrentPostId() postId: Mongoose.Types.ObjectId): Promise<Comment[]> {
    return this.commentService.findAllByPostId(postId);
  }

  @Get(':commentId')
  findOne(@Param('commentId') commentId: Mongoose.Types.ObjectId): Promise<Comment> {
    return this.commentService.findOne(commentId);
  }

  @Patch(':commentId')
  update(@Param('commentId') commentId: Mongoose.Types.ObjectId, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.commentService.update(commentId, updateCommentDto);
  }

  @Delete(':commentId')
  remove(@Param('commentId') commentId: Mongoose.Types.ObjectId): Promise<Comment> {
    return this.commentService.remove(commentId);
  }
}
