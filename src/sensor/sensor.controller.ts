import { Controller, Get, Post, Param, Delete, Body, Query, UseGuards, Request, Patch, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SensorService } from './sensor.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';

@Controller('sensor')
@UseGuards(AuthGuard('jwt'))
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Patch(':id')
  async updateSensor(@Param('id') id: number, @Body() updateSensorDto: UpdateSensorDto, @Req() req) {
    const userId = req.user.userId;
    return this.sensorService.updateSensor(id, updateSensorDto, userId);
  }

  @Get()
  async findAll(@Query() params: any) {}

  @Post()
  async createSensor(@Body() createSensorDto: CreateSensorDto, @Req() req) {
    const userId = req.user.userId;
    return this.sensorService.createSensor(createSensorDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sensorService.remove(+id);
  }
}
