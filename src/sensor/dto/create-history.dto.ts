import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateHistoryDto {
  @IsNumber()
  sensorId: number;

  @IsString()
  name: string;

  @IsNumber()
  value: number;

  @IsOptional()
  time?: Date;
}
