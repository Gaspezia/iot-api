import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entity/history.entity';
import { CreateHistoryDto } from './dto/create-history.dto';
import { Sensor } from '../entity/sensor.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private historyRepository: Repository<History>,
    @InjectRepository(Sensor)
    private sensorRepository: Repository<Sensor>
  ) {}

  async createHistory(createHistoryDto: CreateHistoryDto): Promise<History> {
    const { sensorId, name, value, time } = createHistoryDto;
    const sensor = await this.sensorRepository.findOne({ where: { id: sensorId } });
    if (!sensor) {
      return;
    }
    const history = this.historyRepository.create({
      sensor,
      name,
      value,
      time: time || new Date()
    });

    return this.historyRepository.save(history);
  }
}
