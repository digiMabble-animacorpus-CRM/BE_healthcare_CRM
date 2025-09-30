// src/modules/appointments/entities/appointment.entity.ts

import { BaseModel } from 'src/core/database/BaseModel';
import { 
  Entity, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { TherapistMember } from 'src/modules/therapists-team/entities/therapist-team.entity';
import { Patient } from 'src/modules/customers/entities/patient.entity';
import { Branch } from 'src/modules/branches/entities/branch.entity';
import { Department } from 'src/modules/Department/entities/department.entity';
import { Specialization } from 'src/modules/specialization/entities/specialization.entity';




@Entity({ name: 'appointments' })
export default class Appointment extends BaseModel {

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @ManyToOne(() => Patient, { nullable: false })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;


  @Column({ type: 'timestamptz' })
  startTime: Date;


  @Column({ type: 'timestamptz' })
  endTime: Date;


  @Column({ type: 'text', default: 'pending' })
  status: string;


  @Column({ type: 'text' })
  purposeOfVisit: string;


  @ManyToOne(() => Department, { nullable: false })
  @JoinColumn({ name: 'department_id' })
  department: Department;


  @ManyToOne(() => Specialization, { nullable: true })
  @JoinColumn({ name: 'specialization_id' })
  specialization: Specialization;


  @Column({ type: 'text', nullable: true })
  description: string;


  @ManyToOne(() => TherapistMember, { nullable: false })
  @JoinColumn({ name: 'therapist_id' })
  therapist: TherapistMember;


  @ManyToOne(() => TherapistMember, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: TherapistMember;


  @ManyToOne(() => TherapistMember, { nullable: true })
  @JoinColumn({ name: 'modified_by_id' })
  modifiedBy: TherapistMember;

}