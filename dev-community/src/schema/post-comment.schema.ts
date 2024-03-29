import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Comment } from "./comment.schema";
import { Post } from "./post.schema";

@Schema()
export class PostComment {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
    post: Post;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true })
    comment: Comment;
}

export const PostCommentSchema = SchemaFactory.createForClass(PostComment);
