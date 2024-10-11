import { IsNumber, IsOptional, IsString } from 'class-validator';
import { User } from '../../user/entity/user.entity';

export class CreateSensorDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  high_limit: number;

  @IsNumber()
  low_limit: number;

  @IsOptional()
  user?: User;
}
