import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from 'src/dev/jwt-strategy';

@Controller('post')
@UseGuards(AuthGuard())
export class PostController {
  constructor(private readonly postService: PostService,
    private jwtStrategy: JwtStrategy
  ) { }

  @Post()
  async create(@Body() createPostDto: CreatePostDto,
    @Req() req) {
    const devId = req.user.id;
    return this.postService.create(createPostDto, devId);
  }

  @Get()
  findAll(@Req() req) {
    const userId = req.user.id;
    return this.postService.findAllByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
