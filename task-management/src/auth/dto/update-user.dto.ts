import { PartialType } from '@nestjs/mapped-types';
import { AuthCredentialsDto } from './auth-credentials.dto';

export class UpdateUserDto extends PartialType(AuthCredentialsDto) {
  username?: string;
  password?: string;
}
