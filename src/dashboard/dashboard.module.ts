import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { SensorService } from '../sensor/sensor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from '../sensor/entity/sensor.entity';
import { History } from '../sensor/history/entity/history.entity';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, History, User])],
  controllers: [DashboardController],
  providers: [SensorService]
})
export class DashboardModule {}
