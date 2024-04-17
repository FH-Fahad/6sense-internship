/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from "@nestjs/testing";
import { PostService } from "./post.service";
import { Model } from 'mongoose';
import { CreatePostDto } from "./dto/create-post.dto";
import { DevPostService } from "../dev-post/dev-post.service";
import { Post } from "./entity/post.Schema";
import { PostComment } from "../post-comment/entity/post-comment.Schema";
import { DevPost } from "../dev-post/entity/dev-post.Schema";
import { getModelToken } from "@nestjs/mongoose";
import { InternalServerErrorException } from "@nestjs/common";
import { UpdateCommentDto } from "../comment/dto/update-comment.dto";
import { DevPostDto } from "../dev-post/dto/dev-post.dto";


describe('PostService', () => {
    let postService: PostService;
    let devPostService: DevPostService;
    let postModel: Model<Post>;
    let postCommentModel: Model<PostComment>;
    let devPostModel: Model<DevPost>;

    const mockPostService = {
        create: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        findByIdAndUpdate: jest.fn()
    };

    const mockPostComment = {
        create: jest.fn()
    };

    const mockDevPost = {
        createDevPost: jest.fn()
    };

    const devId = '660d2eff898f6d8e0c76328d';
    const postId = '660d2eff898f6d8e0c76323d';


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostService,
                DevPostService,
                {
                    provide: getModelToken(Post.name),
                    useValue: mockPostService
                }, {
                    provide: getModelToken(PostComment.name),
                    useValue: mockPostComment
                }, {
                    provide: getModelToken(DevPost.name),
                    useValue: mockDevPost
                }
            ],
        }).compile();

        postService = module.get<PostService>(PostService);
        devPostService = module.get<DevPostService>(DevPostService);
        postModel = module.get<Model<Post>>(getModelToken(Post.name));
        postCommentModel = module.get<Model<PostComment>>(getModelToken(PostComment.name));
        devPostModel = module.get<Model<DevPost>>(getModelToken(DevPost.name));
    });

    const createPostDto: CreatePostDto = {
        title: 'test',
        content: 'test',
    };

    const mockPostResponse: any = {
        id: '660d2eff898f6d8e0c76328d',
        title: 'test',
        content: 'test'
    };

    // const devPostDto: DevPostDto = {

    // };

    const updateCommentDto: UpdateCommentDto = {
        content: 'test 1'
    };

    const mockUpdatedPostResponse: any = {
        id: '660d2eff898f6d8e0c76328d',
        title: 'test 1',
        content: 'test 1'
    };

    describe('createPost', () => {
        // it('should create a new post', async () => {
        //     jest.spyOn(postModel, 'create').mockImplementationOnce(() => Promise.resolve(mockPostResponse));

        //     jest.spyOn(devPostService, 'createDevPost').mockImplementationOnce(() => Promise.resolve({
        //         postId: mockPostResponse.id,
        //         devId
        //     }));

        //     const result = await postService.create(createPostDto, devId);

        //     expect(result).toEqual(mockPostResponse);
        // });

        it('should throw InternalServerErrorException if something went wrong', async () => {
            jest.spyOn(postModel, 'create').mockRejectedValueOnce(new Error());

            await expect(postService.create(createPostDto, devId)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw an error if devPostService.createDevPost fails', async () => {
            jest.spyOn(postModel, 'create').mockImplementationOnce(() => Promise.resolve(mockPostResponse));

            jest.spyOn(devPostService, 'createDevPost').mockRejectedValueOnce(new Error());

            await expect(postService.create(createPostDto, devId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('postWithComments', () => {
        it('should return post with comments', async () => {

        });
    });

    // describe('updatePost', () => {
    //     it('should update a post', async () => {
    //         jest.spyOn(postService, 'findById').mockRejectedValueOnce(mockPostResponse);

    //         jest.spyOn(post, 'findByIdAndUpdate').mockResolvedValueOnce(mockUpdatedPostResponse);

    //         const result = await postService.update(mockUpdatedPostResponse._id, updateCommentDto);

    //         expect(result).toEqual(mockUpdatedPostResponse);
    //     });
    // });
});
