import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DevPost } from 'src/schema/dev-post.schema';
import { DevPostDto } from './dto/dev-post.dto';

@Injectable()
export class DevPostService {
    constructor(@InjectModel(DevPost.name) private devPostModel: Model<DevPost>) { }

    async createDevPost(devPostDto: DevPostDto): Promise<DevPost> {
        const createdDevPost = new this.devPostModel(devPostDto);
        return createdDevPost.save();
    }
}
