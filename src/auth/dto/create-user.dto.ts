import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(11, 11)
  tc: string;

  @IsString()
  @Length(6, 20)
  password: string;
}
