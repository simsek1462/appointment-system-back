import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorEntity } from './entities/doctor.entity';
import { HospitalEntity } from 'src/hospital/entities/hospital.entity';
import { ClinicEntity } from 'src/clinic/entities/clinic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DoctorEntity, HospitalEntity, ClinicEntity]),
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
