import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from '../../refresh-token/refresh-token.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 320 })
  email: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_admin: boolean;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_joined: Date;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;
    this.password = await bcrypt.hash(this.password, 10);
  }
}
