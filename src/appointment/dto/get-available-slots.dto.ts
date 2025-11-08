import { IsInt, Matches } from 'class-validator';
export class GetAvailableSlotsDto {
  @IsInt() doctorId: number;
  @Matches(/^\d{4}-\d{2}-\d{2}$/) date: string; // YYYY-MM-DD
}
