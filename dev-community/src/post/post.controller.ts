import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtStrategy } from '../dev/jwt-strategy';
import { PostService } from './post.service';
import { GetCurrentDevId } from '../common/decorators/get-user-id.decorator';
import Mongoose from 'mongoose';

@Controller('post')
@UseGuards(AuthGuard())
export class PostController {
  constructor(private readonly postService: PostService,
    private jwtStrategy: JwtStrategy
  ) { }

  @Post()
  async create(@Body() createPostDto: CreatePostDto,
    @GetCurrentDevId() devId: Mongoose.Types.ObjectId) {
    return this.postService.create(createPostDto, devId);
  }

  @Get()
  findAll(@GetCurrentDevId() devId: Mongoose.Types.ObjectId) {
    return this.postService.findAllByDevId(devId);
  }

  @Get(':id')
  findOne(@Param('id') id: Mongoose.Types.ObjectId) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: Mongoose.Types.ObjectId, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Mongoose.Types.ObjectId) {
    return this.postService.remove(id);
  }
}
