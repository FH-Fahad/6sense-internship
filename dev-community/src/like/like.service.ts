import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Like } from "./entity/like.Schema";
import { LikeStatus } from "./enum/like-status.enum";

@Injectable()
export class LikeService {
    private logger = new Logger();
    constructor(
        @InjectModel('Like') private likeModel: Model<Like>
    ) { }

    async likePost(createLikeDto: any, devId: string): Promise<any> {
        const { postId, action } = createLikeDto;

        const existingLike = await this.likeModel.findOne({ postId, devId });

        if (!existingLike && action === LikeStatus.DISLIKE) {
            this.logger.error(`Developer with id: ${devId} didn't like the post with id: ${postId}`);
            throw new InternalServerErrorException(`Developer didn't like the post before. Only liked post can be disliked`);
        }

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