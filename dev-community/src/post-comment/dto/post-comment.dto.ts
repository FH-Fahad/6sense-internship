import mongoose from 'mongoose';

export class PostCommentDto {
    postId: mongoose.Types.ObjectId;
    commentId: mongoose.Types.ObjectId;
}