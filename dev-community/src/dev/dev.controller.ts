import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Dev } from './entity/dev.Schema';
import { LoginDevDto } from "./dto/login-dev.dto"
import { CreateDevDto } from './dto/create-dev.dto';
import { UpdateDevDto } from './dto/update-dev.dto';
import { DevService } from './dev.service';
import Mongoose from 'mongoose';

@Controller('dev')
export class DevController {
  constructor(private readonly devService: DevService) { }

  // Register a dev
  @Post("/register")
  create(@Body() createDevDto: CreateDevDto): Promise<Dev> {
    return this.devService.create(createDevDto);
  }

  //Login a dev
  @Post("/login")
  login(@Body() loginDevDto: LoginDevDto) {
    return this.devService.login(loginDevDto);
  }

  // Get all dev
  @Get('all')
  findAll(): Promise<Dev[]> {
    return this.devService.findAll();
  }

  // Get a dev
  @Get(':devId')
  findOne(@Param('devId') devId: Mongoose.Types.ObjectId): Promise<Dev> {
    return this.devService.findOne(devId);
  }

  //Update a dev
  @Patch(':devId')
  update(@Param('devId') devId: Mongoose.Types.ObjectId, @Body() updateDevDto: UpdateDevDto): Promise<Dev> {
    return this.devService.update(devId, updateDevDto);
  }

  // Delete a dev
  @Delete(':devId')
  remove(@Param('devId') devId: Mongoose.Types.ObjectId): Promise<Dev> {
    return this.devService.remove(devId);
  }
}
