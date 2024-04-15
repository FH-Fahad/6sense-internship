import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Mongoose, { Model, Types } from 'mongoose';
import { Comment } from './entity/comment.Schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PostComment } from '../post-comment/entity/post-comment.Schema';
import { PostCommentService } from '../post-comment/post-comment.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    private postCommentService: PostCommentService,
    @InjectModel('PostComment') private readonly postCommentModel: Model<PostComment>,
  ) { }

  // Create a new comment
  async create(createCommentDto: CreateCommentDto, postId: Mongoose.Types.ObjectId): Promise<Comment> {
    const comment = new this.commentModel({ content: createCommentDto.content });

    try {
      const saveComment = await comment.save();

      const postComment = {
        postId,
        commentId: saveComment._id
      };

      await this.postCommentService.createPostComment(postComment);
      return saveComment;
    } catch (error) {
      throw new InternalServerErrorException(`Something went wrong`);
    }
  }

  // Find all comments by post ID
  async findAllByPostId(postId: Mongoose.Types.ObjectId): Promise<Comment[]> {
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

    // used $unwind to flatten the array to an object.
    aggregate.push({
      $unwind: '$comment'
    });

    aggregate.push({
      $project: {
        _id: '$comment._id',
        content: '$comment.content',
        createdAt: '$comment.createdAt',
        updatedAt: '$comment.updatedAt'
      }
    });

    const res = await this.postCommentModel.aggregate(aggregate);
    return res;
  }

  // Find one comment by comment ID
  async findOne(commentId: Mongoose.Types.ObjectId): Promise<Comment | null> {
    const isValidCommentId = Mongoose.Types.ObjectId.isValid(commentId)

    if (!isValidCommentId) {
      throw new BadRequestException('Invalid comment ID');
    }

    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException(`Comment with id: ${commentId} not found`);
    }

    return comment;
  }

  // Update a comment
  async update(commentId: Mongoose.Types.ObjectId, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const isValidCommentId = Mongoose.Types.ObjectId.isValid(commentId)

    if (!isValidCommentId) {
      throw new BadRequestException('Invalid comment ID');
    }

    const comment = await this.findOne(commentId);

    if (!comment) {
      throw new BadRequestException(`Comment with id: ${commentId} not found`);
    }

    const updatedComment = await this.commentModel.findByIdAndUpdate(commentId, updateCommentDto);

    return updatedComment;
  }

  // Remove a comment
  async remove(commentId: Mongoose.Types.ObjectId): Promise<Comment> {
    const isValidCommentId = Mongoose.Types.ObjectId.isValid(commentId)

    if (!isValidCommentId) {
      throw new BadRequestException('Invalid comment ID');
    }

    const comment = await this.findOne(commentId);

    if (!comment) {
      throw new NotFoundException(`Comment with id: ${commentId} not found`);
    }

    try {
      await this.postCommentModel.deleteOne({ commentId });
      const deletedComment = await this.commentModel.findByIdAndDelete(commentId);
      return deletedComment;
    } catch (error) {
      throw new InternalServerErrorException(`Something went wrong`);
    }
  }
}
