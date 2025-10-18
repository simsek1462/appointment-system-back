/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(6, 20)
  password?: string;

  @IsOptional()
  @IsString()
  @Length(11, 11)
  tc?: string;
}
