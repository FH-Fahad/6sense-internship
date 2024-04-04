import { Controller, Post, Body, UseGuards, Get, Patch, Delete, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Comment } from './entity/comment.Schema';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCurrentPostId } from 'src/common/decorators/get-user-id.decorator';
import Mongoose from 'mongoose';

@Controller(':postId/comment')
@UseGuards(AuthGuard())
export class CommentController {
  constructor(private readonly commentService: CommentService,
  ) { }

  @Post()
  create(@Body() createCommentDto: CreateCommentDto,
    @GetCurrentPostId() postId: Mongoose.Types.ObjectId): Promise<Comment> {
    return this.commentService.create(createCommentDto, postId);
  }

  @Get('/all')
  findAll(@GetCurrentPostId() postId: Mongoose.Types.ObjectId): Promise<Comment[]> {
    return this.commentService.findAllByPostId(postId);
  }

  @Get(':id')
  findOne(@Param('id') id: Mongoose.Types.ObjectId): Promise<Comment> {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: Mongoose.Types.ObjectId, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Mongoose.Types.ObjectId): Promise<Comment> {
    return this.commentService.remove(id);
  }
}
