import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalService } from './hospital.service';
import { HospitalController } from './hospital.controller';
import { HospitalEntity } from './entities/hospital.entity';
import { ClinicEntity } from 'src/clinic/entities/clinic.entity';
import { CityEntity } from 'src/common/entitties/city.entity';
import { DistrictEntity } from 'src/common/entitties/district.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HospitalEntity,
      ClinicEntity,
      CityEntity,
      DistrictEntity,
    ]),
  ],
  controllers: [HospitalController],
  providers: [HospitalService],
  exports: [HospitalService], // optional: export if other modules need it
})
export class HospitalModule {}
