import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;
}
