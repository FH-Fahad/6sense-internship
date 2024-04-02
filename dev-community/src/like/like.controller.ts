import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { LikeService } from "./like.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateLikeDto } from "./dto/create-like.dto";
// import { GetCurrentUserId } from "../common/decorators/get-user-id.decorator";

@Controller('like')
@UseGuards(AuthGuard())
export class LikeController {
    constructor(private likeService: LikeService) { }

    @Post('post')
    async likePost(@Body() createLikeDto: CreateLikeDto,
        @Req() req) {
        const devId = req.user.id;
        return this.likeService.likePost(createLikeDto, devId);
    }
}