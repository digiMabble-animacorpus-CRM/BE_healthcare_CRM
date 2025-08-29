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
import { Department } from 'src/modules/Department/entities/department.entity';
import { Specialization } from 'src/modules/specialization/entities/specialization.entity';


// Mock enum for "purpose of visit"
export enum PurposeOfVisit {
  CONSULTATION = 'Consultation',
  FOLLOW_UP = 'Follow-up',
  THERAPY_SESSION = 'Therapy Session',
  INITIAL_ASSESSMENT = 'Initial Assessment',
}

// Enum for appointment status
export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity({ name: 'appointments' })
export default class Appointment extends BaseModel {

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @ManyToOne(() => Patient, { nullable: false })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;


  @Column({ type: 'date' })
  date: Date;


  @Column({ type: 'time' })
  startTime: string;


  @Column({ type: 'time' })
  endTime: string;


  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;


  @Column({
    type: 'enum',
    enum: PurposeOfVisit,
  })
  purposeOfVisit: PurposeOfVisit;


  @ManyToOne(() => Department, { nullable: false })
  @JoinColumn({ name: 'department_id' })
  department: Department;


  @ManyToOne(() => Specialization, { nullable: true })
  @JoinColumn({ name: 'specialization_id' })
  specialization: Specialization;


  @Column({ type: 'text', nullable: true })
  description: string;


  @ManyToOne(() => Therapist, { nullable: false })
  @JoinColumn({ name: 'therapist_id' })
  therapist: Therapist;


  @ManyToOne(() => TeamMember, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: TeamMember;


  @ManyToOne(() => TeamMember, { nullable: true })
  @JoinColumn({ name: 'modified_by_id' })
  modifiedBy: TeamMember;

}