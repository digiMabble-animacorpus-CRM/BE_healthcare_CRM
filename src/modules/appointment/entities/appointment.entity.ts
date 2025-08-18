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
import { TeamMember } from 'src/team-member/entities/team-member.entity';


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
  // Fields for patient details are handled by this relationship
  @ManyToOne(() => Patient, { nullable: false, eager: true })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  // Field 6: date
  @Column({ type: 'date' })
  date: Date;

  // Field 7: timeslot
  @Column({ type: 'varchar', length: 50 })
  timeslot: string;

  // Field 8: purpose of visit
  @Column({
    type: 'enum',
    enum: PurposeOfVisit,
  })
  purposeOfVisit: PurposeOfVisit;

  // Field 9: department
  @Column({
    type: 'enum',
    enum: Department,
  })
  department: Department;

  // Field 10: description
  @Column({ type: 'text', nullable: true })
  description: string;

  // Field 11: appointed therapist (references the "therapists" table)
  @ManyToOne(() => Therapist, { nullable: false, eager: true })
  @JoinColumn({ name: 'therapist_id' })
  therapist: Therapist;

  // Field 13: created by (references the "staff" table)
  @ManyToOne(() => TeamMember, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: TeamMember;

  // Field 14: modified by (references the "staff" table)
  @ManyToOne(() => TeamMember, { nullable: true })
  @JoinColumn({ name: 'modified_by_id' })
  modifiedBy: TeamMember;

  // Field 12: created timestamp (handled automatically by @CreateDateColumn)
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  // Field 15: modified timestamp (handled automatically by @UpdateDateColumn)
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}