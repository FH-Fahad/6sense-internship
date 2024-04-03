import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from 'src/dev/jwt-strategy';
import { GetCurrentUserId } from 'src/common/decorators/get-user-id.decorator';

@Controller('post')
@UseGuards(AuthGuard())
export class PostController {
  constructor(private readonly postService: PostService,
    private jwtStrategy: JwtStrategy
  ) { }

  @Post()
  async create(@Body() createPostDto: CreatePostDto,
    @GetCurrentUserId() devId) {
    return this.postService.create(createPostDto, devId);
  }

  @Get()
  findAll(@GetCurrentUserId() devId) {
    return this.postService.findAllByUserId(devId);
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
