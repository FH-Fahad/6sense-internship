import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { LikeService } from "./like.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateLikeDto } from "./dto/create-like.dto";
import { GetCurrentUserId } from "../common/decorators/get-user-id.decorator";

@Controller('like')
@UseGuards(AuthGuard())
export class LikeController {
    constructor(private likeService: LikeService) { }

    @Post('post')
    async likePost(@Body() createLikeDto: CreateLikeDto,
        @GetCurrentUserId() devId: string): Promise<any> {
        return this.likeService.likePost(createLikeDto, devId);
    }
}
