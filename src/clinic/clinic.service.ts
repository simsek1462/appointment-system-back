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
    const hospitals =
      hospitalIds && hospitalIds.length
        ? await this.hospitalRepo.find({ where: { id: In(hospitalIds) } })
        : [];
    const clinic = this.clinicRepo.create({
      ...rest,
      hospitals,
    });
    return await this.clinicRepo.save(clinic);
  }

  async findAll() {
    return await this.clinicRepo.find({
      relations: ['hospitals'],
    });
  }

  async findOne(id: number) {
    const clinic = await this.clinicRepo.findOne({
      where: { id },
      relations: ['hospitals'],
    });
    if (!clinic) throw new NotFoundException(`Clinic ${id} not found`);
    return clinic;
  }

  async update(id: number, updateClinicDto: UpdateClinicDto) {
    const clinic = await this.clinicRepo.findOne({
      where: { id },
      relations: ['hospitals'],
    });

    if (!clinic)
      return new NotFoundException(`Clinic with ID: ${id} not found.`);
    const { hospitalIds, ...rest } = updateClinicDto;

    if (hospitalIds) {
      clinic.hospitals = await this.hospitalRepo.find({
        where: { id: In(hospitalIds) },
      });
    }

    Object.assign(clinic, rest);
    return await this.clinicRepo.save(clinic);
  }

  async remove(id: number) {
    const result = await this.clinicRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Hospital ${id} not found`);
    return { message: `Clinic with ID ${id} deleted successfully` };
  }
}
