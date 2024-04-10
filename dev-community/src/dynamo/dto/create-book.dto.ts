import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookDto {
    @IsNumber()
    @IsNotEmpty()
    bookId: number;

    @IsString()
    @IsNotEmpty()
    bookName: string;
}
