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

  @Post("/register")
  create(@Body() createDevDto: CreateDevDto): Promise<Dev> {
    return this.devService.create(createDevDto);
  }

  @Post("/login")
  login(@Body() loginDevDto: LoginDevDto) {
    return this.devService.login(loginDevDto);
  }

  @Get('all')
  findAll(): Promise<Dev[]> {
    return this.devService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Mongoose.Types.ObjectId): Promise<Dev> {
    return this.devService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: Mongoose.Types.ObjectId, @Body() updateDevDto: UpdateDevDto): Promise<Dev> {
    return this.devService.update(id, updateDevDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Mongoose.Types.ObjectId): Promise<Dev> {
    return this.devService.remove(id);
  }
}
