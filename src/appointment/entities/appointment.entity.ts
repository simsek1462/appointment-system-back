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
import { UserEntity } from 'src/user/entities/user.entity';

export const STATUS_VALUES = ['pending', 'confirmed', 'cancelled'] as const;
export type AppointmentStatus = (typeof STATUS_VALUES)[number];

@Entity('appointments')
export class AppointmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DoctorEntity, (doctor) => doctor.appointments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'doctor_id' })
  doctor: DoctorEntity;

  @ManyToOne(() => HospitalEntity, (hospital) => hospital.appointments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'hospital_id' })
  hospital: HospitalEntity;

  @ManyToOne(() => ClinicEntity, (clinic) => clinic.appointments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'clinic_id' })
  clinic: ClinicEntity;

  @ManyToOne(() => UserEntity, (user) => user.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ nullable: true })
  patientName?: string;

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD

  @Column({ type: 'time' })
  time: string; // HH:mm:ss

  @Column({
    type: 'enum',
    enum: STATUS_VALUES,
  })
  status: AppointmentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
