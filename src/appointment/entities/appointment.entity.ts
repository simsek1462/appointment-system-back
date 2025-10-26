import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { DoctorEntity } from 'src/doctor/entities/doctor.entity';
import { HospitalEntity } from 'src/hospital/entities/hospital.entity';
import { ClinicEntity } from 'src/clinic/entities/clinic.entity';

@Entity('appointments')
export class AppointmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DoctorEntity, (doctor) => doctor.appointments)
  @JoinColumn({ name: 'doctor_id' })
  doctor: DoctorEntity;

  @ManyToOne(() => HospitalEntity, (hospital) => hospital.appointments)
  @JoinColumn({ name: 'hospital_id' })
  hospital: HospitalEntity;

  @ManyToOne(() => ClinicEntity, (clinic) => clinic.appointments)
  @JoinColumn({ name: 'clinic_id' })
  clinic: ClinicEntity;

  @Column()
  patientName: string;

  @Column()
  date: string; // e.g. '2025-10-26'

  @Column()
  time: string; // e.g. '14:30'

  @Column({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'cancelled';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
