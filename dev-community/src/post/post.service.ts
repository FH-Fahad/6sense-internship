import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schema/post.schema';
import { Logger } from '@nestjs/common';

@Injectable()
export class PostService {
  private logger = new Logger();
  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>
  ) { }

  create(createPostDto: CreatePostDto) {
    const { title, content } = createPostDto;
    const post = new this.postModel({ title, content });

    try {
      this.logger.log(`Creating a new post with title: ${title}`);
      return post.save();
    } catch (error) {
      this.logger.error(`Error creating a new post with title: ${title}`);
      throw new InternalServerErrorException(`Something went wrong`);
    }
  }

  findAll() {
    return this.postModel.find();
  }

  findOne(id: string) {
    const post = this.postModel.findById(id);

    if (!post) {
      this.logger.error(`Post with id: ${id} not found`);
      throw new InternalServerErrorException(`Post with id: ${id} not found`);
    }
    this.logger.log(`Retrieving a post with id: ${id}`);
    return this.postModel.findById(id);
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);
    this.logger.log(`${post.title} Updating info.`);
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true });
  }

  async remove(id: string) {
    const post = await this.findOne(id);
    this.logger.log(`${post.title} Removed`);
    return this.postModel.findByIdAndDelete(id);
  }
}
