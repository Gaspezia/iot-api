import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from './entity/sensor.entity';
import { User } from '../user/entity/user.entity';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, User])],
  controllers: [SensorController],
  providers: [SensorService]
})
export class SensorModule {}
