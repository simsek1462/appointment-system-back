import { PartialType } from '@nestjs/mapped-types';
import { CreateHospitalDto } from './create-hospital.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateHospitalDto extends PartialType(CreateHospitalDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsInt()
  city_id?: number;

  @IsOptional()
  @IsInt()
  district_id?: number;
}
