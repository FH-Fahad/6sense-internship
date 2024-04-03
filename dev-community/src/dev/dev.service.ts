import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDevDto } from './dto/create-dev.dto';
import { UpdateDevDto } from './dto/update-dev.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dev } from 'src/schema/dev.schema';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDevDto } from './dto/login-dev.dto';

@Injectable()
export class DevService {
  private logger = new Logger();
  constructor(
    @InjectModel('Dev') private readonly devModel: Model<Dev>,
    private jwtService: JwtService
  ) { }

  async create(createDevDto: CreateDevDto): Promise<Dev> {
    const { email, password, skills, experience } = createDevDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const dev = new this.devModel({
      email,
      password: hashedPassword,
      skills,
      experience,
      refreshToken: ''
    });

    try {
      this.logger.log(`Creating a new dev with email: ${email}`);
      return await dev.save();
    } catch (error) {
      this.logger.error(`Error creating a new dev with email: ${email}`);
      throw new InternalServerErrorException(`Something went wrong`);
    }
  }

  async login(loginDevDto: LoginDevDto) {
    const { email, password } = loginDevDto;
    const dev = await this.devModel.findOne({ email });

    if (!dev) {
      this.logger.error(`Dev with email: ${email} not found`);
      throw new InternalServerErrorException(`Dev with email: ${email} not found`);
    }

    const comparePassword = await bcrypt.compare(password, dev.password);

    if (!comparePassword) {
      this.logger.error(`Invalid password for dev with email: ${email}`);
      throw new InternalServerErrorException(`Invalid password`);
    }

    try {
      if (dev && comparePassword) {
        const { _id } = dev;
        const payload = { id: _id };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        dev.refreshToken = refreshToken;
        await dev.save({ validateBeforeSave: false });

        return { _id, accessToken, refreshToken };
      }
    } catch (error) {
      this.logger.error(`Error logging in dev with email: ${email}`);
      throw new InternalServerErrorException(`Something went wrong`);
    }
  }

  findAll(): Promise<Dev[]> {
    this.logger.log(`Retrieving all users`);
    return this.devModel.find({}, { password: 0, refreshToken: 0, __v: 0 });
  }

  findOne(id: string): Promise<Dev> {
    const dev = this.devModel.findById(id);

    if (!dev) {
      this.logger.error(`Dev with id: ${id} not found`);
      throw new InternalServerErrorException(`Dev with id: ${id} not found`);
    }
    this.logger.log(`Retrieving a dev with id: ${id}`);
    return dev;
  }

  async update(id: string, updateDevDto: UpdateDevDto): Promise<Dev> {
    const dev = await this.findOne(id);
    this.logger.log(`${dev.email} Updating info.`);
    return this.devModel.findByIdAndUpdate(id, updateDevDto, { new: true });
  }

  async remove(id: string): Promise<Dev> {
    const dev = await this.findOne(id);
    this.logger.log(`${dev.email} Removed`);
    return this.devModel.findByIdAndDelete(id);
  }
}
