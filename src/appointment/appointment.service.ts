/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AppointmentEntity } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { GetAvailableSlotsDto } from './dto/get-available-slots.dto';
import { DoctorEntity } from 'src/doctor/entities/doctor.entity';
import { HospitalEntity } from 'src/hospital/entities/hospital.entity';
import { ClinicEntity } from 'src/clinic/entities/clinic.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentService {
  private readonly WORK_START = '09:00';
  private readonly WORK_END = '17:00';
  private readonly SLOT_MIN = 30;
  private readonly BREAKS: Array<[string, string]> = [['12:30', '13:30']];

  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepo: Repository<AppointmentEntity>,
    @InjectRepository(DoctorEntity)
    private readonly doctorRepo: Repository<DoctorEntity>,
    @InjectRepository(HospitalEntity)
    private readonly hospitalRepo: Repository<HospitalEntity>,
    @InjectRepository(ClinicEntity)
    private readonly clinicRepo: Repository<ClinicEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  private toMin(t: string) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }
  private toTimeStr(m: number) {
    const hh = String(Math.floor(m / 60)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    return `${hh}:${mm}:00`;
  }

  private generateSlots() {
    const startM = this.toMin(this.WORK_START);
    const endM = this.toMin(this.WORK_END);
    const breaks = this.BREAKS.map(
      ([s, e]) => [this.toMin(s), this.toMin(e)] as const,
    );
    const slots: string[] = [];

    outer: for (let t = startM; t + this.SLOT_MIN <= endM; t += this.SLOT_MIN) {
      for (const [bs, be] of breaks) {
        if (t >= bs && t < be) continue outer;
      }
      slots.push(this.toTimeStr(t));
    }
    return slots;
  }

  async getAvailableSlots({ doctorId, date }: GetAvailableSlotsDto) {
    const doctor = await this.doctorRepo.findOne({ where: { id: doctorId } });
    if (!doctor) throw new NotFoundException(`Doctor ${doctorId} not found`);

    const taken = await this.appointmentRepo.find({
      where: {
        doctor: { id: doctorId },
        date,
        status: In(['pending', 'confirmed']),
      },
      select: { time: true },
    });

    const takenSet = new Set(
      taken.map((t) => (t.time.length === 5 ? `${t.time}:00` : t.time)),
    );

    const allSlots = this.generateSlots();
    const available = allSlots.filter((s) => !takenSet.has(s));

    return { doctorId, date, available };
  }

  async create(dto: CreateAppointmentDto) {
    const {
      doctorId,
      hospitalId,
      clinicId,
      userId,
      date,
      time,
      status,
      patientName,
    } = dto;

    const [doctor, hospital, clinic, user] = await Promise.all([
      this.doctorRepo.findOne({ where: { id: doctorId } }),
      this.hospitalRepo.findOne({ where: { id: hospitalId } }),
      this.clinicRepo.findOne({ where: { id: clinicId } }),
      this.userRepo.findOne({ where: { id: userId } }),
    ]);
    if (!doctor) throw new NotFoundException(`Doctor ${doctorId} not found`);
    if (!hospital)
      throw new NotFoundException(`Hospital ${hospitalId} not found`);
    if (!clinic) throw new NotFoundException(`Clinic ${clinicId} not found`);
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    // Çakışma kontrolü
    const exists = await this.appointmentRepo.findOne({
      where: {
        doctor: { id: doctorId },
        date,
        time,
        status: In(['pending', 'confirmed']),
      },
    });
    if (exists)
      throw new ConflictException(
        'Bu saat dolu, lütfen başka bir saat seçiniz.',
      );

    const appointment = this.appointmentRepo.create({
      doctor,
      hospital,
      clinic,
      user,
      date,
      time,
      status: status ?? 'pending',
      patientName,
    });

    try {
      return await this.appointmentRepo.save(appointment);
    } catch (e: any) {
      if (e?.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'Bu saat dolu, lütfen başka bir saat seçiniz.',
        );
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateAppointmentDto) {
    const appt = await this.appointmentRepo.findOne({
      where: { id },
      relations: ['doctor', 'hospital', 'clinic', 'user'],
    });
    if (!appt) throw new NotFoundException(`Appointment ${id} not found`);
    if (dto.status && !dto.date && !dto.time && !dto.doctorId) {
      appt.status = dto.status;
      return this.appointmentRepo.save(appt);
    }
    const newDoctorId = dto.doctorId ?? appt.doctor.id;
    const newDate = dto.date ?? appt.date;
    const newTime = dto.time ?? appt.time;

    if (dto.doctorId && dto.doctorId !== appt.doctor.id) {
      const newDoctor = await this.doctorRepo.findOne({
        where: { id: dto.doctorId },
      });
      if (!newDoctor)
        throw new NotFoundException(`Doctor ${dto.doctorId} not found`);
      appt.doctor = newDoctor;
    }

    if (dto.date || dto.time || dto.doctorId) {
      const clash = await this.appointmentRepo.findOne({
        where: {
          doctor: { id: newDoctorId },
          date: newDate,
          time: newTime,
          status: In(['pending', 'confirmed']),
        },
      });
      if (clash && clash.id !== appt.id) {
        throw new ConflictException(
          'Bu saat dolu, lütfen başka bir saat seçiniz.',
        );
      }
      appt.date = newDate;
      appt.time = newTime;
    }

    if (dto.status) appt.status = dto.status;

    try {
      return await this.appointmentRepo.save(appt);
    } catch (e: any) {
      if (e?.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'Bu saat dolu, lütfen başka bir saat seçiniz.',
        );
      }
      throw e;
    }
  }
  async findAll() {
    return this.appointmentRepo.find({
      relations: ['doctor', 'hospital', 'clinic', 'user'],
      order: { date: 'ASC', time: 'ASC' },
    });
  }

  async findOne(id: number) {
    const appt = await this.appointmentRepo.findOne({
      where: { id },
      relations: ['doctor', 'hospital', 'clinic', 'user'],
    });
    if (!appt) throw new NotFoundException(`Appointment ${id} not found`);
    return appt;
  }

  async remove(id: number) {
    const result = await this.appointmentRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Appointment ${id} not found`);
    }
    return { message: `Appointment ${id} deleted successfully` };
  }
}
