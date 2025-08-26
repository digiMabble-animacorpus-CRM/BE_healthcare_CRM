import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Consultation } from 'src/modules/consultations/entities/consultation.entity';

export enum SpecializationType {
  CONSULTATION = 'Consultation',
  OPERATION = 'Operation',
  OTHER = 'Other',
}

@Entity({ name: 'specializations' })
export class Specialization {
  @PrimaryGeneratedColumn('increment')
  specialization_id: number;

  @Column()
  department_id: number;

  @Column({ type: 'varchar', length: 150 })
  doctor_name: string;

  @Column({ type: 'varchar', length: 100 })
  patient_name: string;

  @Column({
    type: 'enum',
    enum: SpecializationType,
  })
  specialization_type: SpecializationType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(
    () => Consultation,
    (consultation) => consultation.specializations,
  )
  @JoinColumn({ name: 'consultation_id' })
  consultation: Consultation;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false, select: false })
  is_deleted: boolean;

  @CreateDateColumn({ type: 'timestamp', select: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, select: false })
  deleted_at: Date;
}
