import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ClinicEntity } from './entities/clinic.entity';
import { HospitalEntity } from 'src/hospital/entities/hospital.entity';

@Injectable()
export class ClinicService {
  constructor(
    @InjectRepository(ClinicEntity)
    private readonly clinicRepo: Repository<ClinicEntity>,
    @InjectRepository(HospitalEntity)
    private readonly hospitalRepo: Repository<HospitalEntity>,
  ) {}

  async create(createClinicDto: CreateClinicDto) {
    const { hospitalIds, ...rest } = createClinicDto;
    const hospitals = await this.hospitalRepo.find({
      where: { id: In(hospitalIds) },
    });
    const clinic = this.clinicRepo.create({
      ...rest,
      hospitals,
    });
    return await this.clinicRepo.save(clinic);
  }

  async findAll() {
    return await this.clinicRepo.find();
  }

  async findOne(id: number) {
    const clinic = await this.clinicRepo.findOne({ where: { id } });
    if (!clinic) throw new NotFoundException(`Clinic ${id} not found`);
    return clinic;
  }

  update(id: number, updateClinicDto: UpdateClinicDto) {
    return `This action updates a #${id} clinic`;
  }

  remove(id: number) {
    return `This action removes a #${id} clinic`;
  }
}
