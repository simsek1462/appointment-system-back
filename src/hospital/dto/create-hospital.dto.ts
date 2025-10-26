import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateHospitalDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsInt()
  city_id: number;

  @IsInt()
  district_id: number;
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  clinicIds?: number[];
}
