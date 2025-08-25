import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Consultation } from 'src/modules/consultations/entities/consultation.entity';
import { Therapist } from 'src/modules/therapist/entities/therapist.entity';

@Entity({ name: 'function_description' })
export class FunctionDescription {
  @PrimaryGeneratedColumn('uuid')
  function_id: string;

  @Column({ type: 'text', nullable: true })
  fonction: string;

  @Column({ name: 'function_description', type: 'text', nullable: true })
  function_description_text: string;

  @Column({ type: 'text', nullable: true })
  simplification_description: string;

  @Column({ type: 'text', nullable: true })
  communication_patients: string;

  @Column({ type: 'text', nullable: true })
  tone_communication: string;

  @Column({ type: 'text', nullable: true })
  professional_1: string;

  @Column({ type: 'text', nullable: true })
  professional_2: string;

  @Column({ type: 'text', nullable: true })
  professional_3: string;

  @Column({ type: 'text', nullable: true })
  professional_4: string;

  @Column({ type: 'text', nullable: true })
  professional_5: string;

  @Column({ type: 'text', nullable: true })
  professional_6: string;

  @Column({ type: 'text', nullable: true })
  professional_7: string;

  @Column({ type: 'text', nullable: true })
  professional_8: string;

  @Column({ type: 'text', nullable: true })
  professional_9: string;

  // --- Relationships ---

  @ManyToOne(
    () => Consultation,
    (consultation) => consultation.function_descriptions,
  )
  @JoinColumn({ name: 'consultation_id' })
  consultation: Consultation;

  @ManyToMany(() => Therapist)
  @JoinTable({
    name: 'function_description_therapists',
    joinColumn: { name: 'function_id', referencedColumnName: 'function_id' },
    inverseJoinColumn: { name: '_key', referencedColumnName: '_key' },
  })
  therapists: Therapist[];

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
