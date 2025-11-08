import { IsOptional, Matches, IsInt, IsIn } from 'class-validator';
import {
  STATUS_VALUES,
  type AppointmentStatus,
} from '../entities/appointment.entity';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsIn(STATUS_VALUES)
  status?: AppointmentStatus;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;

  @IsOptional()
  @Matches(/^\d{2}:\d{2}:\d{2}$/)
  time?: string;

  @IsOptional()
  @IsInt()
  doctorId?: number;
}
