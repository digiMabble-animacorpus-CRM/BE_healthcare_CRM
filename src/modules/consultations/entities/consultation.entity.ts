import { IsUUID } from 'class-validator';
import { BaseModel } from 'src/core/database/BaseModel';
import { Branch } from 'src/modules/branches/entities/branch.entity';
import { FunctionDescription } from 'src/modules/function-description/entities/function-description.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'consultations' })
export class Consultation  {
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


  @OneToMany(
    () => FunctionDescription,
    (functionDescription) => functionDescription.consultation,
  )
  function_descriptions: FunctionDescription[];
}
