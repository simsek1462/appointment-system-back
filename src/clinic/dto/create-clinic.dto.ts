// create-clinic.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsInt,
} from 'class-validator';

export class CreateClinicDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  hospitalIds: number[];
}
