import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorEntity } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { HospitalEntity } from 'src/hospital/entities/hospital.entity';
import { ClinicEntity } from 'src/clinic/entities/clinic.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorRepo: Repository<DoctorEntity>,

    @InjectRepository(HospitalEntity)
    private readonly hospitalRepo: Repository<HospitalEntity>,

    @InjectRepository(ClinicEntity)
    private readonly clinicRepo: Repository<ClinicEntity>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const { hospitalId, clinicId, ...rest } = createDoctorDto;

    const hospital = await this.hospitalRepo.findOne({
      where: { id: hospitalId },
    });
    if (!hospital)
      throw new NotFoundException(`Hospital ${hospitalId} not found`);

    const clinic = await this.clinicRepo.findOne({ where: { id: clinicId } });
    if (!clinic) throw new NotFoundException(`Clinic ${clinicId} not found`);

    const doctor = this.doctorRepo.create({
      ...rest,
      hospital,
      clinic,
    });

    return await this.doctorRepo.save(doctor);
  }

  async findAll() {
    return await this.doctorRepo.find({ relations: ['hospital', 'clinic'] });
  }

  async findOne(id: number) {
    const doctor = await this.doctorRepo.findOne({
      where: { id },
      relations: ['hospital', 'clinic'],
    });
    if (!doctor) throw new NotFoundException(`Doctor ${id} not found`);
    return doctor;
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    const doctor = await this.doctorRepo.findOne({
      where: { id },
      relations: ['hospital', 'clinic'],
    });
    if (!doctor) throw new NotFoundException(`Doctor ${id} not found`);

    const { hospitalId, clinicId, ...rest } = updateDoctorDto;

    if (hospitalId) {
      const hospital = await this.hospitalRepo.findOne({
        where: { id: hospitalId },
      });
      if (!hospital)
        throw new NotFoundException(`Hospital ${hospitalId} not found`);
      doctor.hospital = hospital;
    }

    if (clinicId) {
      const clinic = await this.clinicRepo.findOne({ where: { id: clinicId } });
      if (!clinic) throw new NotFoundException(`Clinic ${clinicId} not found`);
      doctor.clinic = clinic;
    }

    Object.assign(doctor, rest);
    return await this.doctorRepo.save(doctor);
  }

  async remove(id: number) {
    const result = await this.doctorRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Doctor ${id} not found`);
    return { message: `Doctor with ID ${id} deleted successfully` };
  }
}
