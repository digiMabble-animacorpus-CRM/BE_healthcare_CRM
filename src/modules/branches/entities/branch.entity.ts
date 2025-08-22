import { BaseModel } from 'src/core/database/BaseModel';
import { Consultation } from 'src/modules/consultations/entities/consultation.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'branches' })
export class Branch  {
  @PrimaryGeneratedColumn('uuid')
  branch_id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

@OneToMany(() => Consultation, (consultation) => consultation.branch)
  consultations: Consultation[];
}