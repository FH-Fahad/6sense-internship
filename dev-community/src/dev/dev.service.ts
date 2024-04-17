import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Dev } from './entity/dev.Schema';
import { CreateDevDto } from './dto/create-dev.dto';
import { UpdateDevDto } from './dto/update-dev.dto';
import { LoginDevDto } from './dto/login-dev.dto';

@Injectable()
export class DevService {
  constructor(
    @InjectModel('Dev') private readonly devModel: Model<Dev>,
    private jwtService: JwtService
  ) { }

  // Create a new dev
  async create(createDevDto: CreateDevDto): Promise<Dev> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createDevDto.password, salt);

    const dev = new this.devModel({
      email: createDevDto.email,
      password: hashedPassword,
      skills: createDevDto.skills,
      experience: createDevDto.experience,
      refreshToken: ''
    });

    try {
      return await dev.save();
    } catch (error) {
      throw new InternalServerErrorException(`Something went wrong`);
    }
  }

  // Login a dev
  async login(loginDevDto: LoginDevDto) {
    const dev = await this.devModel.findOne({ email: loginDevDto.email });

    if (!dev) {
      throw new BadRequestException(`Dev with email: ${loginDevDto.email} not found`);
    }

    const comparePassword = await bcrypt.compare(loginDevDto.password, dev.password);

    if (!comparePassword) {
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
      throw new InternalServerErrorException(`Something went wrong`);
    }
  }

  // Return all devs info
  findAll(): Promise<Dev[]> {
    return this.devModel.find({}, { password: 0, refreshToken: 0, __v: 0 });
  }

  // Find a dev by id
  findOne(devId: string): Promise<Dev> {
    const dev = this.devModel.findById(devId);

    if (!dev) {
      throw new BadRequestException(`Dev with id: ${devId} not found`);
    }

    return dev;
  }

  // Update a dev info
  async update(devId: string, updateDevDto: UpdateDevDto): Promise<Dev> {
    await this.findOne(devId);

    try {
      return this.devModel.findByIdAndUpdate(devId, updateDevDto, { new: true });
    } catch (error) {
      throw new InternalServerErrorException(`Something went wrong`);
    }
  }

  // Remove a dev
  async remove(devId: string): Promise<Dev> {
    await this.findOne(devId);

    try {
      return this.devModel.findByIdAndDelete(devId);
    } catch (error) {
      throw new InternalServerErrorException(`Something went wrong`);
    }
  }
}
