import { Module } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { ClinicController } from './clinic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicEntity } from './entities/clinic.entity';
import { HospitalEntity } from 'src/hospital/entities/hospital.entity';
import { DoctorEntity } from 'src/doctor/entities/doctor.entity';
import { AppointmentEntity } from 'src/appointment/entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClinicEntity,
      HospitalEntity,
      DoctorEntity,
      AppointmentEntity,
    ]),
  ],
  controllers: [ClinicController],
  providers: [ClinicService],
})
export class ClinicModule {}
