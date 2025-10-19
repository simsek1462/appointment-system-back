import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('districts')
export class DistrictEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
