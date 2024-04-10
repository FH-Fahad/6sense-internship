import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAuthorDto {
    @IsNumber()
    @IsNotEmpty()
    authorId: number;

    @IsString()
    @IsNotEmpty()
    authorName: string;
}
