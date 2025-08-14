import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BaseModel } from 'src/core/database/BaseModel';
import { Address } from 'src/modules/addresses/entities/address.entity';
import { Branch } from 'src/modules/branches/entities/branch.entity';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import  { Token }  from 'src/modules/users/entities/token.entity'; 
import User from 'src/modules/users/entities/user.entity'; // Adjust the import path as necessary
export enum AccessLevel {
  STAFF = 'staff',
  BRANCH_ADMIN = 'branch-admin',
  SUPER_ADMIN = 'super-admin',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface CertificationFile {
  path: string;
  preview: string | null;
  formattedSize: string;
}

export interface AvailabilitySlot {
  day: string;
  from: string;
  to: string;
}

export interface LoginDetails {
  otpVerified: boolean;
  lastLogin?: string;
  loginCount?: number;
  deviceInfo?: string;
}

@Entity('staff')
export class Staff extends BaseModel {
  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column('text', { array: true })
  languages: string[];

  @OneToOne(() => Address, { cascade: true, eager: true })
  @JoinColumn({ name: 'address' })
  address: Address;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  dob: string;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ name: 'accessLevel', type: 'enum', enum: AccessLevel })
  accessLevel: string;

  @ManyToMany(() => Branch)
  @JoinTable({
    name: 'staffBranches',
    joinColumn: { name: 'staffId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'branchId', referencedColumnName: 'id' },
  })
  branches: Branch[];

  @ManyToOne(() => Branch, { eager: true })
  @JoinColumn({ name: 'selectedBranch' })
  selectedBranch: Branch;

  @Column({ nullable: true })
  specialization: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true })
  registrationNumber: string;

  @Column('jsonb', { nullable: true })
  certificationFiles: CertificationFile[];

  @Column('jsonb', { nullable: true })
  availability: AvailabilitySlot[];

  @Column('text', { array: true, nullable: true })
  tags: string[];

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @ManyToMany(() => Permission, { eager: true })
  @JoinTable({
    name: 'staffPermissions',
    joinColumn: { name: 'staffId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  @Column('jsonb')
  loginDetails: LoginDetails;

  @Column()
  createdBy: number;

  @Column({ nullable: true })
  updatedBy: number;

  @OneToMany(() => Token, token => token.staff)
  tokens: Token[];

@OneToOne(() => User, (user) => user.staff, {
  cascade: true,
  onDelete: 'CASCADE',
})
@JoinColumn({ name: 'user_id' })
user: User;


  // 📌 Additional columns from CSV file:
  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ nullable: true })
  targetAudience: string;

  @Column({ nullable: true })
  specialization1: string;

  @Column({ nullable: true })
  consultations: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ nullable: true })
  schedule: string;

  @Column({ nullable: true })
  about: string;

  @Column({ nullable: true })
  paymentMethods: string;

  @Column({ nullable: true })
  degreesAndTraining: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  faq: string;

  @Column({ nullable: true })
  agendaLinks: string;

  @Column({ nullable: true })
  importedTable2: string;

  @Column({ nullable: true })
  field27: string;

  @Column({ nullable: true })
  importedTable22: string;

  @Column({ nullable: true })
  teamNamur1: string;

  @Column({ nullable: true })
  importedTable23: string;

  @Column({ nullable: true })
  teamNamur2: string;

  @Column({ nullable: true })
  sites: string;

  @Column({ nullable: true })
  specialization2: string;

  @Column({ nullable: true })
  rosaLink: string;

  @Column({ nullable: true })
  googleAgendaLink: string;

  @Column({ nullable: true })
  appointmentStart: string;

  @Column({ nullable: true })
  appointmentEnd: string;

  @Column({ nullable: true })
  appointmentAlert: string;
}
