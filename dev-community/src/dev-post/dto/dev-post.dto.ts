import mongoose from 'mongoose';

export class DevPostDto {
    devId: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
}
