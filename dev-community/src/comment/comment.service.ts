import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import Mongoose, { Model } from 'mongoose';
import { Comment } from 'src/schema/comment.schema';
import { Logger } from '@nestjs/common';
import { PostCommentService } from 'src/post-comment/post-comment.service';
import { PostComment } from 'src/schema/post-comment.schema';

@Injectable()
export class CommentService {
  private logger = new Logger();
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    private postCommentService: PostCommentService,
    @InjectModel('PostComment') private readonly postCommentModel: Model<PostComment>,
  ) { }

  async create(createCommentDto: CreateCommentDto, postId: Mongoose.Types.ObjectId) {
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
      return { saveComment, postComment };
    } catch (error) {
      this.logger.error(`Error creating a new comment with content: ${content}`);
      throw new InternalServerErrorException(`Something went wrong`);
    }
  }

  async findAllByPostId(postId: string): Promise<Comment[]> {
    const postComments = await this.postCommentModel.find({ postId }).exec();
    const commentIds = postComments.map(postComment => postComment.commentId);
    return this.commentModel.find({ _id: { $in: commentIds } }).exec();
  }

  findOne(id: string) {
    const comment = this.commentModel.findById(id);

    if (!comment) {
      this.logger.error(`Comment with id: ${id} not found`);
      throw new InternalServerErrorException(`Comment with id: ${id} not found`);
    }
    this.logger.log(`Retrieving a comment with id: ${id}`);
    return this.commentModel.findById(id);
  }


  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findOne(id);
    this.logger.log(`${comment.id} updated.`);
    return this.commentModel.findByIdAndUpdate(id, updateCommentDto, { new: true })
  }

  async remove(id: string) {
    const comment = await this.findOne(id);
    this.logger.log(`${comment.id} deleted.`);
    return this.commentModel.findByIdAndDelete(id);
  }
}
