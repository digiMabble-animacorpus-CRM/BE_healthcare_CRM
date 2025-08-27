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
import { Therapist } from 'src/modules/therapist/entities/therapist.entity';
import { Patient } from 'src/modules/customers/entities/patient.entity';
import { TeamMember } from 'src/modules/team-member/entities/team-member.entity';
import { Branch } from 'src/modules/branches/entities/branch.entity';


// Mock enum for "purpose of visit"
export enum PurposeOfVisit {
  CONSULTATION = 'Consultation',
  FOLLOW_UP = 'Follow-up',
  THERAPY_SESSION = 'Therapy Session',
  INITIAL_ASSESSMENT = 'Initial Assessment',
}

// Mock enum for "department"
export enum Department {
  PSYCHOLOGY = 'Psychology',
  PHYSIOTHERAPY = 'Physiotherapy',
  NUTRITION = 'Nutrition',
  GENERAL_MEDICINE = 'General Medicine',
}

@Entity({ name: 'appointments' })
export default class Appointment extends BaseModel {

  @ManyToOne(() => Branch, { nullable: false, eager: true })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @ManyToOne(() => Patient, { nullable: false, eager: true })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;


  @Column({ type: 'date' })
  date: Date;


  @Column({ type: 'varchar', length: 50 })
  timeslot: string;


  @Column({
    type: 'enum',
    enum: PurposeOfVisit,
  })
  purposeOfVisit: PurposeOfVisit;


  @Column({
    type: 'enum',
    enum: Department,
  })
  department: Department;


  @Column({ type: 'text', nullable: true })
  description: string;


  @ManyToOne(() => Therapist, { nullable: false, eager: true })
  @JoinColumn({ name: 'therapist_id' })
  therapist: Therapist;


  @ManyToOne(() => TeamMember, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: TeamMember;


  @ManyToOne(() => TeamMember, { nullable: true })
  @JoinColumn({ name: 'modified_by_id' })
  modifiedBy: TeamMember;

}