import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './auth.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    try {
      this.logger.log(`User ${username} created`);
      return this.userRepository.save(newUser);
    } catch (err) {
      if (err.code === '23505') {
        throw new Error('Username already exists');
      } else {
        this.logger.error(
          `User ${username} field to create account`,
          err.message,
        );
        throw new InternalServerErrorException('Something went wrong');
      }
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOneBy({ username });

    try {
      if (user && (await bcrypt.compare(password, user.password))) {
        const payload: JwtPayload = { username };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
      } else {
        this.logger.error(`User ${username} has invalid credentials`);
        throw new UnauthorizedException('Invalid credentials');
      }
    } catch (err) {
      this.logger.error(`User ${username} failed to sign in`, err.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      this.logger.error(`User with ID ${id} not found`);
      throw new Error('User not found');
    }
    return user;
  }

  async findOneByUsername(username: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      this.logger.error(`User with username ${username} not found`);
      throw new Error('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    try {
      this.logger.log(`User with ID ${id} updated`);
      return this.userRepository.save({ ...user, ...updateUserDto });
    } catch (err) {
      this.logger.error(`User with ID ${id} failed to update`, err.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    try {
      this.logger.log(`User with ID ${id} removed`);
      return this.userRepository.remove(user);
    } catch (err) {
      this.logger.error(`User with ID ${id} failed to remove`, err.message);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
