import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Branch } from 'src/modules/branches/entities/branch.entity';
import { Specialization } from 'src/modules/specialization/entities/specialization.entity';

@Entity({ name: 'consultations' })
export class Consultation {
  @PrimaryGeneratedColumn('uuid')
  consultation_id: string;

  @Column({ type: 'text', nullable: true })
  our_consultations: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  for_whom: string;

  @Column({ type: 'text', nullable: true })
  care_process: string;

  @Column({ type: 'text', nullable: true })
  fees_and_reimbursements: string;

  // --- Relationships ---

  @ManyToOne(() => Branch, (branch) => branch.consultations)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  // @OneToMany(
  //   () => Specialization,
  //   (specialization) => specialization.consultation,
  // )
  // specializations: Specialization[];

  @Column({ type: 'boolean', default: true, select: true })
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
