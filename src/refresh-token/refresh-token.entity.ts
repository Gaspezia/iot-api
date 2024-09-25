import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/entity/user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens, { nullable: true, onDelete: 'SET NULL' })
  user: User;
}
