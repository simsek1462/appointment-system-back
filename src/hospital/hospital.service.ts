import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HospitalEntity } from './entities/hospital.entity';
import { Repository, In } from 'typeorm';
import { ClinicEntity } from 'src/clinic/entities/clinic.entity';
import { CityEntity } from 'src/common/entitties/city.entity';
import { DistrictEntity } from 'src/common/entitties/district.entity';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(HospitalEntity)
    private readonly hospitalRepo: Repository<HospitalEntity>,
    @InjectRepository(ClinicEntity)
    private readonly clinicRepo: Repository<ClinicEntity>,
  ) {}
  async create(createHospitalDto: CreateHospitalDto) {
    const { city_id, district_id, clinicIds, ...rest } = createHospitalDto;
    const clinics = clinicIds
      ? await this.clinicRepo.find({ where: { id: In(clinicIds) } })
      : [];
    const hospital = this.hospitalRepo.create({
      ...rest,
      city: { id: city_id },
      district: { id: district_id },
      clinics,
    });
    return await this.hospitalRepo.save(hospital);
  }

  async findAll() {
    return await this.hospitalRepo.find();
  }

  async findOne(id: number) {
    const hospital = await this.hospitalRepo.findOne({ where: { id } });
    if (!hospital) throw new NotFoundException(`Hospital ${id} not found`);
    return hospital;
  }

  async update(id: number, updateHospitalDto: UpdateHospitalDto) {
    const hospital = await this.hospitalRepo.findOne({
      where: { id },
      relations: ['clinics', 'city', 'district'],
    });

    if (!hospital) {
      throw new NotFoundException(`Hospital ${id} not found`);
    }

    const { city_id, district_id, clinicIds, ...rest } = updateHospitalDto;
    if (clinicIds) {
      hospital.clinics = await this.clinicRepo.find({
        where: { id: In(clinicIds) },
      });
    }

    hospital.city = { id: city_id } as CityEntity;
    hospital.district = { id: district_id } as DistrictEntity;

    Object.assign(hospital, rest);

    return await this.hospitalRepo.save(hospital);
  }
  async remove(id: number) {
    const result = await this.hospitalRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Hospital ${id} not found`);
    return { message: `Hospital with ID ${id} deleted successfully` };
  }
}
