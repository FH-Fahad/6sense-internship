import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDevDto } from './dto/create-dev.dto';
import { UpdateDevDto } from './dto/update-dev.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dev } from 'src/schema/dev.schema';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DevService {
  private logger = new Logger();
  constructor(
    @InjectModel('Dev') private readonly devModel: Model<Dev>,
    private jwtService: JwtService
  ) { }

  async create(createDevDto: CreateDevDto) {
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

  async generateAccessAndRefreshToken(dev) {
    const { _id, email } = dev;

    const user = await this.devModel
      .findOne({ _id })

    if (!user) {
      this.logger.error(`Dev with email: ${email} not found`);
      throw new InternalServerErrorException(`Dev with email: ${email} not found`);
    }

    const accessTokenPayload = { id: _id, email: dev.email };
    const refreshTokenPayload = { id: _id };

    const accessToken = this.jwtService.sign(accessTokenPayload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(refreshTokenPayload, { expiresIn: '7d' });

    dev.refreshToken = refreshToken;
    await dev.save({ validateBeforeSave: false });

    this.logger.log(`Refresh token generated for ${email}`);
    return { accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const dev = await this.devModel.findOne({ email });

    if (!dev) {
      this.logger.error(`Dev with email: ${email} not found`);
      throw new InternalServerErrorException(`Dev with email: ${email} not found`);
    }

    const validPassword = await bcrypt.compare(password, dev.password);

    if (!validPassword) {
      this.logger.error(`Invalid password`);
      throw new InternalServerErrorException(`Invalid password`);
    }
    return await this.generateAccessAndRefreshToken(dev);
  }

  findAll() {
    this.logger.log(`Retrieving all users`);
    return this.devModel.find();
  }

  findOne(id: string) {
    const dev = this.devModel.findById(id);

    if (!dev) {
      this.logger.error(`Dev with id: ${id} not found`);
      throw new InternalServerErrorException(`Dev with id: ${id} not found`);
    }
    this.logger.log(`Retrieving a dev with id: ${id}`);
    return this.devModel.findById(id);
  }

  async update(id: string, updateDevDto: UpdateDevDto) {
    const dev = await this.findOne(id);
    this.logger.log(`${dev.email} Updating info.`);
    return this.devModel.findByIdAndUpdate(id, updateDevDto, { new: true });
  }

  async remove(id: string) {
    const dev = await this.findOne(id);
    this.logger.log(`${dev.email} Removed`);
    return this.devModel.findByIdAndDelete(id);
  }
}
