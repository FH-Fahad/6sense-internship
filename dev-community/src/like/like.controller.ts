import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreateLikeDto } from "./dto/create-like.dto";
import { LikeService } from "./like.service";
import { GetCurrentDevId } from "../common/decorators/get-user-id.decorator";
import Mongoose from 'mongoose';

@Controller('like')
@UseGuards(AuthGuard())
export class LikeController {
    constructor(private likeService: LikeService) { }

    @Post('post')
    async likePost(@Body() createLikeDto: CreateLikeDto,
        @GetCurrentDevId() devId: Mongoose.Types.ObjectId): Promise<any> {
        return this.likeService.likePost(createLikeDto, devId);
    }
}
