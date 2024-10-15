import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SensorService } from '../sensor/sensor.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private readonly sensorService: SensorService) {}

  @Get()
  async getDashboardData(@Req() req) {
    const userId = req.user.userId;
    return this.sensorService.getDashboardData(userId);
  }
}
