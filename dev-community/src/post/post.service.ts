import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import Mongoose, { Model } from 'mongoose';
import { Post } from '../post/entity/post.Schema';
import { DevPostService } from '../dev-post/dev-post.service';
import { DevPost } from '../dev-post/entity/dev-post.Schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    private readonly devPostService: DevPostService,
    @InjectModel('DevPost') private readonly devPostModel: Model<DevPost>
  ) { }

  async create(createPostDto: CreatePostDto, devId: Mongoose.Types.ObjectId): Promise<Post> {
    const post = new this.postModel({
      title: createPostDto.title,
      content: createPostDto.content
    });

    try {
      const postSave = await post.save();

      const devPost = {
        postId: postSave._id,
        devId
      };

      await this.devPostService.createDevPost(devPost);

      return postSave;
    } catch (error) {
      throw new InternalServerErrorException(`Something went wrong`);
    }
  }

  async findAllByDevId(devId: Mongoose.Types.ObjectId): Promise<Post[]> {
    const devPosts = await this.devPostModel.find({ devId: devId }).exec();
    const postIds = devPosts.map(devPost => devPost.postId);
    return this.postModel.find({ _id: { $in: postIds } }).exec();
  }

  findOne(id: Mongoose.Types.ObjectId) {
    const post = this.postModel.findById(id);

    if (!post) {
      throw new InternalServerErrorException(`Post with id: ${id} not found`);
    }
    return this.postModel.findById(id);
  }

  async update(id: Mongoose.Types.ObjectId, updatePostDto: UpdatePostDto) {
    await this.findOne(id);
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true });
  }

  async remove(id: Mongoose.Types.ObjectId) {
    await this.findOne(id);
    await this.devPostModel.deleteOne({ postId: id });
    return this.postModel.findByIdAndDelete(id);
  }
}
