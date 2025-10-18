/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(11, 11)
  tc: string;

  @IsString()
  @Length(6, 20)
  password: string;
}
