import { IsInt, IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  doctorId: number;

  @IsInt()
  hospitalId: number;

  @IsInt()
  clinicId: number;

  @IsString()
  @IsNotEmpty()
  patientName: string;

  @IsString()
  @IsNotEmpty()
  date: string; // DD-MM-YYYY

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsOptional()
  @IsIn(['pending', 'confirmed', 'cancelled'])
  status?: 'pending' | 'confirmed' | 'cancelled';
}
