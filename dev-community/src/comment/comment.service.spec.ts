import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import Mongoose from 'mongoose';

const mockCommentService = {
    create: jest.fn((comment) => ({ ...comment, id: '660d2eff898f6d8e0c76328d' })),
};

const mockComment = {
    content: 'This is a test comment'
};

const postId = '660d2eff898f6d8e0c76328d';

const mockCommentResponse = {
    ...mockComment,
    id: '660d2eff898f6d8e0c76328d',
};

describe('CommentService', () => {
    let commentService: CommentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentService,
                {
                    provide: CommentService,
                    useFactory: () => mockCommentService
                },
            ],
        }).compile();

        commentService = module.get<CommentService>(CommentService);
    });

    it('should create a new comment', async () => {
        expect(mockCommentService.create).not.toHaveBeenCalled();

        const comment = await commentService.create(mockComment, new Mongoose.Types.ObjectId(postId));
        expect(comment).toEqual(mockCommentResponse);

        expect(mockCommentService.create).toHaveBeenCalled();
    });
});