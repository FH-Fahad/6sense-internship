import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Mongoose, { Model, Types } from 'mongoose';
import { Comment } from './entity/comment.Schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PostComment } from '../post-comment/entity/post-comment.Schema';
import { PostCommentService } from '../post-comment/post-comment.service';

@Injectable()
export class CommentService {
  private logger = new Logger();
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    private postCommentService: PostCommentService,
    @InjectModel('PostComment') private readonly postCommentModel: Model<PostComment>,
  ) { }

  async create(createCommentDto: CreateCommentDto, postId: Mongoose.Types.ObjectId): Promise<Comment> {
    const { content } = createCommentDto;

    const comment = new this.commentModel({ content });

    try {
      this.logger.log(`Creating a new comment with content: ${content}`);
      const saveComment = await comment.save();

      const postComment = {
        postId,
        commentId: saveComment._id
      };

      this.postCommentService.createPostComment(postComment);

      this.logger.log(`Comment for ${postId} with content: ${content} created successfully`);
      return saveComment;
    } catch (error) {
      this.logger.error(`Error creating a new comment with content: ${content}`);
      throw new InternalServerErrorException(`Something went wrong`);
    }
  }

  async findAllByPostId(postId: string): Promise<Comment[]> {
    const aggregate = [];
    aggregate.push({
      $match: {
        postId: new Types.ObjectId(postId)
      }
    });
    aggregate.push({
      $lookup: {
        from: 'comments',
        localField: 'commentId',
        foreignField: '_id',
        as: 'comment'
      }
    });
    aggregate.push({
      $unwind: '$comment'
    });
    aggregate.push({
      $project: {
        _id: '$comment._id',
        content: '$comment.content'
      }
    });
    const res = await this.postCommentModel.aggregate(aggregate);
    return res;
    // const postComments = await this.postCommentModel.find({ postId }).exec();
    // const commentIds = postComments.map(postComment => postComment.commentId);
    // return this.commentModel.find({ _id: { $in: commentIds } }).exec();
  }

  findOne(id: string): Promise<Comment> {
    const comment = this.commentModel.findById(id);

    if (!comment) {
      this.logger.error(`Comment with id: ${id} not found`);
      throw new InternalServerErrorException(`Comment with id: ${id} not found`);
    }
    this.logger.log(`Retrieving a comment with id: ${id}`);
    return this.commentModel.findById(id);
  }


  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findOne(id);
    if (!comment) {
      this.logger.error(`Comment with id: ${id} not found`);
      throw new InternalServerErrorException(`Comment with id: ${id} not found`);
    }

    this.logger.log(`Updating a comment with id: ${id}`);
    return this.commentModel.findByIdAndUpdate(id, updateCommentDto, { new: true })
  }

  async remove(id: string): Promise<Comment> {
    const comment = await this.findOne(id);
    if (!comment) {
      this.logger.error(`Comment with id: ${id} not found`);
      throw new InternalServerErrorException(`Comment with id: ${id} not found`);
    }
    this.logger.log(`Deleting a comment with id: ${id}`);
    await this.postCommentModel.deleteMany({ commentId: id });
    return this.commentModel.findByIdAndDelete(id);
  }
}
