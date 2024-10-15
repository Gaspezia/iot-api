import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from './entity/sensor.entity';
import { User } from '../user/entity/user.entity';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';
import { History } from './history/entity/history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, User, History])],
  controllers: [SensorController],
  providers: [SensorService]
})
export class SensorModule {}
