// update-clinic.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateClinicDto } from './create-clinic.dto';
import {
  IsArray,
  IsInt,
  ArrayNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateClinicDto extends PartialType(CreateClinicDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  hospitalIds?: number[];
}
