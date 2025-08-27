import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm';
import { Consultation } from 'src/modules/consultations/entities/consultation.entity';
import { Therapist } from 'src/modules/therapist/entities/therapist.entity';

@Entity({ name: 'branches' })
export class Branch {
  @PrimaryGeneratedColumn('increment')
  branch_id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @OneToMany(() => Consultation, (consultation) => consultation.branch)
  consultations: Consultation[];

    @ManyToMany(() => Therapist, (therapist) => therapist.branches)
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