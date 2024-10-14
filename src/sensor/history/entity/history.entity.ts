import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sensor } from '../../entity/sensor.entity';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'timestamp', nullable: true })
  time: Date;

  @Column()
  value: number;

  @OneToOne(() => Sensor, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  sensor: Sensor;
}
