import { IsString, IsInt } from 'class-validator';

export class CreateHospitalDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsInt()
  city_id: number;

  @IsInt()
  district_id: number;
}
