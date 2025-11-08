import { IsInt, IsString, IsOptional, IsIn, Matches } from 'class-validator';
import {
  STATUS_VALUES,
  type AppointmentStatus,
} from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsInt() doctorId: number;
  @IsInt() hospitalId: number;
  @IsInt() clinicId: number;
  @IsInt() userId: number;

  @IsOptional() @IsString() patientName?: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string; // YYYY-MM-DD

  @Matches(/^\d{2}:\d{2}:\d{2}$/)
  time: string; // HH:mm:ss

  @IsOptional()
  @IsIn(STATUS_VALUES)
  status?: AppointmentStatus;
}
