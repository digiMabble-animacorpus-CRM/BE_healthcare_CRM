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
} from 'typeorm';
import { BaseModel } from 'src/core/database/BaseModel';
import { Address } from 'src/modules/addresses/entities/address.entity';
import { Branch } from 'src/modules/branches/entities/branch.entity';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { Role } from 'src/modules/roles/entities/role.entity';

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
  phone_number: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column('text', { array: true })
  languages: string[];

  @OneToOne(() => Address, { cascade: true, eager: true })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  dob: string;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ type: 'enum', enum: AccessLevel })
  access_level: AccessLevel;

  @ManyToMany(() => Branch)
  @JoinTable({
    name: 'staff_branches',
    joinColumn: { name: 'staff_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'branch_id', referencedColumnName: 'id' },
  })
  branches: Branch[];

  @ManyToOne(() => Branch, { eager: true })
@JoinColumn({ name: 'selected_branch' })
selected_branch: Branch;


  @Column({ nullable: true })
  specialization: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true })
  registration_number: string;

  @Column('jsonb', { nullable: true })
  certification_files: CertificationFile[];

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
    name: 'staff_permissions',
    joinColumn: { name: 'staff_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  @Column('jsonb')
  login_details: LoginDetails;

  @Column()
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;
}
