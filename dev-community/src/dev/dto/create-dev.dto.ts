import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateDevDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    skills: string;

    @IsString()
    @IsNotEmpty()
    experience: string;
}
