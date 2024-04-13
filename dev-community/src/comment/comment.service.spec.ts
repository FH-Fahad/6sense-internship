import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from "./comment.service";
import Mongoose from 'mongoose';

const mockCommentService = {
    create: jest.fn((comment) => ({ ...comment, id: '660d2eff898f6de0c76328e' })),

    findOne: jest.fn(() => ({ id: '660d2eff898f6d8e0c76328e' })),

    update: jest.fn((commentId, mockUpdateComment) => ({ ...commentId, ...mockUpdateComment })),

    remove: jest.fn((commentId) => ({ ...commentId })),
};

describe('CommentService', () => {
    let commentService: CommentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentService,
                {
                    provide: CommentService,
                    useValue: mockCommentService,
                },
            ],
        }).compile();

        commentService = module.get<CommentService>(CommentService);
    });

    describe('create a comment', () => {

        const mockComment = {
            content: 'This is a comment',
        };

        const mockCommentResponse = {
            ...mockComment,
            id: '660d2eff898f6de0c76328e',
        };

        const postId = new Mongoose.Types.ObjectId('660d2eff898f6d8e0c76328d');

        it('should create a new comment', async () => {
            expect(mockCommentService.create).not.toHaveBeenCalled();

            const comment = await commentService.create(mockComment, postId);
            expect(comment).toEqual(mockCommentResponse);

            expect(mockCommentService.create).toHaveBeenCalled();
        });
    });

    describe('find one comment by comment Id', () => {

        const commentId = new Mongoose.Types.ObjectId('660d2eff898f6d8e0c76328e');

        const mockCommentResponse = {
            id: '660d2eff898f6d8e0c76328e',
        };

        it('should find one comment by comment Id', async () => {
            expect(mockCommentService.findOne).not.toHaveBeenCalled();

            const comment = await commentService.findOne(commentId);
            expect(comment).toEqual(mockCommentResponse);

            expect(mockCommentService.findOne).toHaveBeenCalled();
        });
    });

    describe('should update a comment by comment Id', () => {

        const commentId = new Mongoose.Types.ObjectId('660d2eff898f6d8e0c76328e');

        const mockUpdateComment = {
            content: 'This is an updated comment'
        };

        const mockCommentResponse = {
            ...mockUpdateComment,
            ...commentId,
        };

        it('should update a comment by comment Id', async () => {
            expect(mockCommentService.update).not.toHaveBeenCalled();

            const comment = await commentService.update(commentId, mockUpdateComment);
            expect(comment).toEqual(mockCommentResponse);

            expect(mockCommentService.update).toHaveBeenCalled();
        });
    });

    describe('should remove a comment by comment Id', () => {

        it('should remove a comment by comment Id', async () => {
            const commentId = new Mongoose.Types.ObjectId('660d2eff898f6d8e0c76328e');

            expect(mockCommentService.remove).not.toHaveBeenCalled();

            const comment = await commentService.remove(commentId);
            expect(comment).toEqual(commentId);

            expect(mockCommentService.remove).toHaveBeenCalled();
        });
    });
});
