import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HospitalEntity } from './entities/hospital.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(HospitalEntity)
    private readonly hospitalRepo: Repository<HospitalEntity>,
  ) {}
  async create(createHospitalDto: CreateHospitalDto) {
    const { city_id, district_id, ...rest } = createHospitalDto;
    const hospital = this.hospitalRepo.create({
      ...rest,
      city: { id: city_id },
      district: { id: district_id },
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
    const hospital = await this.hospitalRepo.findOne({ where: { id } });
    if (!hospital) throw new NotFoundException(`Hospital ${id} not found`);
    const { city_id, district_id, ...rest } = updateHospitalDto;
    await this.hospitalRepo.update(id, {
      ...rest,
      city: { id: city_id },
      district: { id: district_id },
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.hospitalRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Hospital ${id} not found`);
    return { message: `Hospital with ID ${id} deleted successfully` };
  }
}
