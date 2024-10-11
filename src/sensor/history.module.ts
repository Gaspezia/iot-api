import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { History } from './entity/history.entity';
import { Sensor } from './entity/sensor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([History, Sensor])],
  controllers: [HistoryController],
  providers: [HistoryService]
})
export class HistoryModule {}
