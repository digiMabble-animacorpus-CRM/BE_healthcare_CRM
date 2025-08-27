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
import { Department } from 'src/modules/Department/entities/department.entity';

export enum SpecializationType {
  CONSULTATION = 'Consultation',
  OPERATION = 'Operation',
  OTHER = 'Other',
}

@Entity({ name: 'specializations' })
export class Specialization {
  @PrimaryGeneratedColumn('increment')
  specialization_id: number;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({
    type: 'enum',
    enum: SpecializationType,
  })
  specialization_type: SpecializationType;

  @Column({ type: 'text', nullable: true })
  description: string;

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
