import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, MoreThan, Repository } from 'typeorm';
import { Sensor } from './entity/sensor.entity';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { User } from '../user/entity/user.entity';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { History } from './history/entity/history.entity';

@Injectable()
export class SensorService {
  constructor(
    @InjectRepository(Sensor)
    private sensorRepository: Repository<Sensor>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(History)
    private historyRepository: Repository<History>
  ) {}
  createQueryBuilder(alias: string) {
    return this.sensorRepository.createQueryBuilder(alias);
  }

  findAll(): Promise<Sensor[]> {
    return this.sensorRepository.find();
  }

  findOne(id: number): Promise<Sensor> {
    return this.sensorRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.sensorRepository.delete(id);
  }

  async getDashboardData(userId: number) {
    const sensors = await this.sensorRepository.find({ where: { user: { id: userId } } });
    const dashboardData = [];

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 200);

    for (const sensor of sensors) {
      const sensorHistory = await this.historyRepository.find({
        where: {
          sensor: { id: sensor.id },
          time: MoreThan(twentyFourHoursAgo)
        },
        order: { time: 'ASC' }
      });

      const sensorData = sensorHistory.map((entry) => ({
        value: entry.value,
        time: this.formatDate(entry.time)
      }));

      dashboardData.push({
        sensorId: sensor.id,
        type: sensor.type,
        sensorName: sensor.name,
        highLimit: sensor.high_limit,
        lowLimit: sensor.low_limit,
        data: sensorData
      });
    }

    return {
      data: dashboardData
    };
  }

  async create(sensor: CreateSensorDto): Promise<Sensor> {
    const savedSensor = await this.sensorRepository.save(sensor);
    return savedSensor;
  }

  async createSensor(createSensorDto: CreateSensorDto, userId: number): Promise<Sensor> {
    const sensorExists = await this.sensorRepository.findOneBy({ id: createSensorDto.id });
    if (sensorExists) {
      throw new ConflictException('A sensor with this ID already exists');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const sensor = this.sensorRepository.create({
      ...createSensorDto,
      user: user
    });

    return await this.sensorRepository.save(sensor);
  }

  async updateSensor(id: number, updateSensorDto: UpdateSensorDto, userId: number): Promise<Sensor> {
    const sensor = await this.sensorRepository.findOne({ where: { id }, relations: ['user'] });

    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }

    if (sensor.user.id !== userId) {
      throw new ForbiddenException('You do not own this sensor');
    }

    Object.assign(sensor, updateSensorDto);

    return await this.sensorRepository.save(sensor);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
