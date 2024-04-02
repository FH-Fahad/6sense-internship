import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Like } from "src/schema/likeSchema";
import { Logger } from "@nestjs/common";

@Injectable()
export class LikeService {
    private logger = new Logger();
    constructor(
        @InjectModel('Like') private likeModel: Model<Like>
    ) { }

    async likePost(createLikeDto: any, userId: string) {
        const { postId, action } = createLikeDto;

        const like = new this.likeModel({ postId, userId, action });

        try {
            this.logger.log(`Liking a post with id: ${postId}`);
            const liked = await like.save();
            return liked;
        } catch (error) {
            this.logger.error(`Error liking a post with id: ${postId}`);
            throw new InternalServerErrorException(`Something went wrong`);
        }
    }
}