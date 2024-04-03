import { Controller, Post, Body, UseGuards, Req, Get, Patch, Delete, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Comment } from './entity/comment.Schema';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller(':postId/comment')
@UseGuards(AuthGuard())
export class CommentController {
  constructor(private readonly commentService: CommentService,
  ) { }

  @Post()
  create(@Body() createCommentDto: CreateCommentDto,
    @Req() req): Promise<Comment> {
    const postId = req.params.postId;
    return this.commentService.create(createCommentDto, postId);
  }

  @Get('/all')
  findAll(@Req() req): Promise<Comment[]> {
    const postId = req.params.postId;
    return this.commentService.findAllByPostId(postId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Comment> {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Comment> {
    return this.commentService.remove(id);
  }
}
