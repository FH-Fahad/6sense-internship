import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetCurrentDevId = createParamDecorator(
    (data, context: ExecutionContext): string => {
        const req = context.switchToHttp().getRequest();
        console.log(req.user);
        return req.user.id;
    },
);

export const GetCurrentPostId = createParamDecorator(
    (data, context: ExecutionContext): string => {
        const req = context.switchToHttp().getRequest();
        return req.params.postId;
    },
);