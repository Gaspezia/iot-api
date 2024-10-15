import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sensor } from '../../entity/sensor.entity';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: true })
  time: Date;

  @Column({ type: 'float' })
  value: number;

  @ManyToOne(() => Sensor, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  sensor: Sensor;
}
