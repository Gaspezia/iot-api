import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Sensor } from './entity/sensor.entity';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { User } from '../user/entity/user.entity';
import { UpdateSensorDto } from './dto/update-sensor.dto';

@Injectable()
export class SensorService {
  constructor(
    @InjectRepository(Sensor)
    private sensorRepository: Repository<Sensor>,
    @InjectRepository(User)
    private usersRepository: Repository<User>
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
}
