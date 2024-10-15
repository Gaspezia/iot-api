import { User } from '../../user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

export enum SensorType {
  TEMPERATURE = 'Temperature',
  LIGHT = 'Lumière'
}

@Entity()
export class Sensor {
  @PrimaryColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({
    type: 'enum',
    enum: SensorType
  })
  type: SensorType;

  @Column({ type: 'float' })
  high_limit: number;

  @Column({ type: 'float' })
  low_limit: number;

  @ManyToOne(() => User, (user) => user.sensors, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  user: User;
}
