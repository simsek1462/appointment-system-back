import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ClinicEntity } from 'src/clinic/entities/clinic.entity';
import { HospitalEntity } from 'src/hospital/entities/hospital.entity';

@Entity('doctors')
export class DoctorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  specialization: string;

  @Column()
  phone: string;

  @ManyToOne(() => HospitalEntity, (hospital) => hospital.doctors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hospital_id' })
  hospital: HospitalEntity;

  @ManyToOne(() => ClinicEntity, (clinic) => clinic.doctors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clinic_id' })
  clinic: ClinicEntity;
}
