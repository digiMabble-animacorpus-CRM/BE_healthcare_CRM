import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { Department } from 'src/modules/Department/entities/department.entity';
import { Branch } from 'src/modules/branches/entities/branch.entity';
import { Specialization } from 'src/modules/specialization/entities/specialization.entity';
import User from 'src/modules/users/entities/user.entity';

export enum MemberRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  STAFF = 'staff',
}

export enum MemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('therapist_team_members')
export class TherapistMember {
  @PrimaryGeneratedColumn({ name: 'therapist_id', type: 'int' })
  therapistId: number;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({
    name: 'full_name',
    type: 'varchar',
    length: 200,
    generatedType: 'STORED',
    asExpression: "first_name || ' ' || last_name",
  })
  fullName: string;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl?: string;

  @Column({ name: 'contact_email', type: 'varchar', length: 255 })
  contactEmail: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 20 })
  contactPhone: string;

  @Column({ name: 'about_me', type: 'text', default: '' })
  aboutMe: string;

  @Column({ name: 'degrees_training', type: 'text',  default: '{}' })
  degreesTraining: string;

  @Column({ name: 'inami_number', type: 'bigint', nullable: true })
  inamiNumber?: number;

  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'::jsonb" })
payment_methods: string[];

@Column({ type: 'jsonb', nullable: true, default: () => "'[]'::jsonb" })
faq: { question: string; answer: string }[];


  @Column({ name: 'website', type: 'varchar', length: 255, nullable: true })
  website?: string;

  @Column({ name: 'consultations', type: 'text', default: '' })
  consultations: string;

  @Column({ type: 'jsonb', nullable: true, default: () => "'{}'::jsonb" })
permissions: Record<string, any>;

  @Column({ type: 'enum', enum: MemberRole, default: MemberRole.STAFF })
  role: MemberRole;

  @Column({ type: 'enum', enum: MemberStatus, default: MemberStatus.ACTIVE })
  status: MemberStatus;

@Column({ type: 'jsonb', nullable: true, default: () => "'[]'::jsonb" })
availability: { day: string; startTime: string; endTime: string }[];

  @Column({ name: 'spoken_languages', type: 'text', array: true, default: '{}' })
  languagesSpoken: string[];

  @Column({ name: 'is_delete', type: 'boolean', default: false })
  isDelete: boolean;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  // --- Relations ---
  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'department_id' })
  department?: Department;

@ManyToMany(() => Specialization, { cascade: true })
@JoinTable({
  name: 'therapist_specializations',
  joinColumn: { name: 'therapist_id', referencedColumnName: 'therapistId' },
  inverseJoinColumn: { name: 'specialization_id', referencedColumnName: 'specialization_id' },
})
specializations: Specialization[];


  @ManyToMany(() => Branch, { cascade: true })
  @JoinTable({
    name: 'therapist_branches',
    joinColumn: { name: 'therapist_id', referencedColumnName: 'therapistId' },
    inverseJoinColumn: { name: 'branch_id', referencedColumnName: 'branch_id' },
  })
  branches: Branch[];

  @ManyToOne(() => Branch, { nullable: true })
  @JoinColumn({ name: 'primary_branch_id' })
  primaryBranch?: Branch;


@OneToMany(() => User, (user) => user.therapistTeamMembers)
users: User[];

}
