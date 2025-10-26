import { DoctorEntity } from 'src/doctor/entities/doctor.entity';
import { HospitalEntity } from 'src/hospital/entities/hospital.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clinics')
export class ClinicEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name: string;
  @ManyToMany(() => HospitalEntity, (hospital) => hospital.clinics)
  @JoinTable()
  hospitals: HospitalEntity[];
  @OneToMany(() => DoctorEntity, (doctor) => doctor.clinic)
  doctors?: DoctorEntity[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
