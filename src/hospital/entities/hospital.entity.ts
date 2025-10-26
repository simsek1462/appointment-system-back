import { ClinicEntity } from 'src/clinic/entities/clinic.entity';
import { CityEntity } from 'src/common/entitties/city.entity';
import { DistrictEntity } from 'src/common/entitties/district.entity';
import { DoctorEntity } from 'src/doctor/entities/doctor.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';

@Entity('hospitals')
export class HospitalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  address: string;

  @ManyToOne(() => CityEntity)
  @JoinColumn({ name: 'city_id' }) // SQL tarafındaki kolon ismiyle eşleştir
  city: CityEntity;

  @ManyToOne(() => DistrictEntity)
  @JoinColumn({ name: 'district_id' })
  district: DistrictEntity;
  @ManyToMany(() => ClinicEntity, (clinic) => clinic.hospitals)
  clinics?: ClinicEntity[];
  @OneToMany(() => DoctorEntity, (doctor) => doctor.hospital)
  doctors?: DoctorEntity[];
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
