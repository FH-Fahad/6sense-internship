import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import Mongoose, { Model } from 'mongoose';
import { Post } from 'src/schema/post.schema';
import { Logger } from '@nestjs/common';
import { DevPostService } from 'src/dev-post/dev-post.service';
import { DevPost } from 'src/schema/dev-post.schema';

@Injectable()
export class PostService {
  private logger = new Logger();
  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    private readonly devPostService: DevPostService,
    @InjectModel('DevPost') private readonly devPostModel: Model<DevPost>
  ) { }

  async create(createPostDto: CreatePostDto, devId: Mongoose.Types.ObjectId) {
    const { title, content } = createPostDto;

    const post = new this.postModel({ title, content });

    try {
      this.logger.log(`Creating a new post with title: ${title}`);
      const postSave = await post.save();

      const devPost = {
        postId: postSave._id,
        devId
      };

      this.devPostService.createDevPost(devPost);

      return { postSave, devPost };
    } catch (error) {
      this.logger.error(`Error creating a new post with title: ${title}`);
      throw new InternalServerErrorException(`Something went wrong`);
    }
  }

  async findAllByUserId(userId: string): Promise<Post[]> {
    const devPosts = await this.devPostModel.find({ devId: userId }).exec();
    const postIds = devPosts.map(devPost => devPost.postId);
    return this.postModel.find({ _id: { $in: postIds } }).exec();
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
