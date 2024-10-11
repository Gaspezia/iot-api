import { User } from '../../user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Sensor {
  @PrimaryColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column()
  high_limit: number;

  @Column()
  low_limit: number;

  @ManyToOne(() => User, (user) => user.sensors, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  user: User;
}
