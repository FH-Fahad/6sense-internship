import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { LikeStatus } from "src/like/enum/like-status.enum";
import mongoose from 'mongoose';

@Schema()
export class Like {
    @Prop()
    action: LikeStatus;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    postId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Dev' })
    userId: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
