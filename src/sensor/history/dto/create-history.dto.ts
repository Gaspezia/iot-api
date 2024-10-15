import { IsNumber, IsOptional } from 'class-validator';

export class CreateHistoryDto {
  @IsNumber()
  sensorId: number;

  @IsNumber()
  value: number;

  @IsOptional()
  time?: Date;
}
