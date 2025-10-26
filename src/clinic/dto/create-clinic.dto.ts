import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
} from 'class-validator';

export class CreateClinicDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  hospitalIds?: number[];
}
