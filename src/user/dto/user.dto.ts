import { IsBoolean, IsString } from 'class-validator';

export class CreateUserDto {
  email: string;

  @IsBoolean()
  is_admin: boolean;

  @IsString()
  password: string;
}
