import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DevService } from './dev.service';
import { CreateDevDto } from './dto/create-dev.dto';
import { UpdateDevDto } from './dto/update-dev.dto';
import { Dev } from 'src/schema/dev.schema';
import { LoginDevDto } from "./dto/login-dev.dto"

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

  @Get()
  findAll(): Promise<Dev[]> {
    return this.devService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Dev> {
    return this.devService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDevDto: UpdateDevDto): Promise<Dev>{
    return this.devService.update(id, updateDevDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Dev>{
    return this.devService.remove(id);
  }
}
