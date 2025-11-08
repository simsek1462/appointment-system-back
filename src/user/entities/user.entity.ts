import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppointmentEntity } from 'src/appointment/entities/appointment.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tc: string;

  @Column()
  password: string;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.user)
  appointments: AppointmentEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = (await bcrypt.hash(this.password, 10)) as string;
  }
}
