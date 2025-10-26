import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  specialization?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsInt()
  hospitalId: number;

  @IsInt()
  clinicId: number;
}
