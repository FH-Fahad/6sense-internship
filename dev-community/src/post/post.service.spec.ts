import { Test } from "@nestjs/testing";
import { PostService } from "./post.service";
import Mongoose from 'mongoose';

const mockPostService = {
    create: jest.fn((post) => ({ ...post, id: '660d2eff898f6d8e0c76328d' })),
    findAllByDevId: jest.fn(() => 'findAllByDevId'),
    findOne: jest.fn(() => 'findOne'),
};

const mockPost = {
    title: 'test',
    content: 'test',
};

const devId = '660d2eff898f6d8e0c76328d';

const mockPostResponse = {
    title: 'test',
    content: 'test',
    id: '660d2eff898f6d8e0c76328d',
};

describe('PostService', () => {
    let postService: PostService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                PostService,
                { provide: PostService, useFactory: () => mockPostService }
            ],
        }).compile();

        postService = module.get<PostService>(PostService);
    });

    it('creating a new post', async () => {
        expect(mockPostService.create).not.toHaveBeenCalled();

        const post = await postService.create(mockPost, new Mongoose.Types.ObjectId(devId));
        expect(post).toEqual(mockPostResponse);
        
        expect(mockPostService.create).toHaveBeenCalled();
    });

    it('find all posts by devId', async () => {
        expect(mockPostService.findAllByDevId).not.toHaveBeenCalled();
        const posts = await postService.findAllByDevId(new Mongoose.Types.ObjectId(devId));
        expect(posts).toEqual('findAllByDevId');
        expect(mockPostService.findAllByDevId).toHaveBeenCalled();
    });

    it('find one post by id', async () => {
        expect(mockPostService.findOne).not.toHaveBeenCalled();
        const post = await postService.findOne(new Mongoose.Types.ObjectId(devId));
        expect(post).toEqual('findOne');
        expect(mockPostService.findOne).toHaveBeenCalled();
    });
});
