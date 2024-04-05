import { Test } from "@nestjs/testing";
import { PostService } from "./post.service";
import Mongoose from 'mongoose';

const mockPostService = {
    create: jest.fn((post) => ({ ...post, id: '660d2eff898f6d8e0c76328d' })),

    findOne: jest.fn((postId) => ({ id: postId.toString() })),

    update: jest.fn((postId, post) => ({ ...post, id: postId.toString() })),
    
    remove: jest.fn((postId) => ({ id: postId.toString() })),
};

const devId = new Mongoose.Types.ObjectId('660d2eff898f6d8e0c76328d');
const postId = new Mongoose.Types.ObjectId('660d2eff898f6d8e0c76323d');

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


    describe('PostService', () => {
        it('should create a new post', async () => {
            const post = await postService.create({
                title: 'test',
                content: 'test',
            }, devId);
            expect(post).toEqual({
                id: '660d2eff898f6d8e0c76328d',
                title: 'test',
                content: 'test'
            });
        });
    });

    describe('PostService', () => {
        it('should find and return the post if it exists', async () => {
            const post = await postService.findOne(postId);
            expect(post).toEqual({
                id: '660d2eff898f6d8e0c76323d'
            });
        });
    });

    describe('PostService', () => {
        it('update a post', async () => {
            const post = await postService.update(postId, { title: 'test 1', content: 'test 1' });
            expect(post).toEqual({
                id: '660d2eff898f6d8e0c76323d',
                title: 'test 1',
                content: 'test 1'
            });
        });
    });

    describe('PostService', () => {
        it('remove a post', async () => {
            const post = await postService.remove(postId);
            expect(post).toEqual({
                id: '660d2eff898f6d8e0c76323d'
            });
        });
    });
});
