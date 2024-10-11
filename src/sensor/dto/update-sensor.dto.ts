import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSensorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  high_limit?: number;

  @IsOptional()
  @IsNumber()
  low_limit?: number;
}
