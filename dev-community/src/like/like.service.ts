import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Like } from "./entity/like.Schema";
import Mongoose from 'mongoose';
import { CreateLikeDto } from "./dto/create-like.dto";

@Injectable()
export class LikeService {
    private logger = new Logger();
    constructor(
        @InjectModel('Like') private likeModel: Model<Like>
    ) { }

    async likePost(createLikeDto: CreateLikeDto, devId: Mongoose.Types.ObjectId): Promise<any> {
        const { postId, action } = createLikeDto;

        const like = new this.likeModel({ postId, devId, action });

        try {
            this.logger.log(`${action} a post with id: ${postId}`);
            const liked = await like.save();
            return liked;
        } catch (error) {
            this.logger.error(`Error liking a post with id: ${postId}`);
            throw new InternalServerErrorException(`Something went wrong`);
        }
    }
}