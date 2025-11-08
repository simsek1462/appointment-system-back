import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { AppointmentEntity } from './entities/appointment.entity';
import { DoctorEntity } from 'src/doctor/entities/doctor.entity';
import { HospitalEntity } from 'src/hospital/entities/hospital.entity';
import { ClinicEntity } from 'src/clinic/entities/clinic.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AppointmentEntity,
      DoctorEntity,
      HospitalEntity,
      ClinicEntity,
      UserEntity,
    ]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [TypeOrmModule], // eğer başka modüller kullanacaksa
})
export class AppointmentModule {}
