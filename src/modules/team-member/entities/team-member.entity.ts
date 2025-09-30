import { Entity, PrimaryGeneratedColumn, Column,OneToMany,ManyToMany, JoinTable,ManyToOne, JoinColumn } from 'typeorm';
import  User  from 'src/modules/users/entities/user.entity'; // Adjust the import path as necessary
import { Branch } from 'src/modules/branches/entities/branch.entity';





export enum TeamMemberRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  THERAPIST = 'therapist',
}


export enum TeamMemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}


@Entity('team_member_list')
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  team_id: string;

  @Column({ type: 'varchar', length: 100, nullable: false, default: '' })
  last_name: string;

  @Column({ type: 'varchar', length: 100, nullable: false, default: '' })
  first_name: string;

  @Column({ type: 'varchar', length: 200, nullable: false, default: '' })
  full_name: string;

  @Column({ type: 'varchar', length: 150, nullable: false, default: '' })
  job_1: string;

  @Column({ type: 'varchar', length: 150, nullable: false, default: '' })
  specific_audience: string;

  @Column({ type: 'varchar', length: 150, nullable: false, default: '' })
  specialization_1: string;

  @Column({ type: 'varchar', length: 150, nullable: false, default: '' })
  job_2: string;

  @Column({ type: 'varchar', length: 150, nullable: false, default: '' })
  job_3: string;

  @Column({ type: 'varchar', length: 150, nullable: false, default: '' })
  job_4: string;

  @Column({ type: 'text', nullable: false, default: '' })
  who_am_i: string;

  @Column({ type: 'text', nullable: false, default: '' })
  consultations: string;

  @Column({ type: 'varchar', length: 1000, nullable: false, default: '' })
  office_address: string;

  @Column({ type: 'varchar', length: 150, nullable: false, default: '' })
  contact_email: string;

  @Column({ type: 'varchar', length: 20, nullable: false, default: '' })
  contact_phone: string;

  @Column({ type: 'jsonb', nullable: false })
  schedule: object;

  @Column({ type: 'text', nullable: false, default: '' })
  about: string;

  @Column({ type: 'text', array: true, nullable: false})
  languages_spoken: string[];

  @Column({ type: 'text', array: true, nullable: false })
  payment_methods: string[];

  @Column({ type: 'text', array: true, nullable: false })
  diplomas_and_training: string[];

  @Column({ type: 'text', array: true, nullable: false})
  specializations: string[];

  @Column({ type: 'varchar', length: 255, nullable: false, default: '' })
  website: string;

  @Column({ type: 'jsonb', nullable: false})
  frequently_asked_questions: object;

  @Column({ type: 'text', array: true, nullable: false })
  calendar_links: string[];

  @Column({ type: 'varchar', length: 255, nullable: false, default: '' })
  photo: string;

  @Column({ type: 'boolean', default: false })
  is_delete: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  @Column({ type: 'enum', enum: TeamMemberRole, default: TeamMemberRole.THERAPIST })
  role: TeamMemberRole;

  @Column({ type: 'jsonb', nullable: false })
  permissions: object;


  @Column({ type: 'enum', enum: TeamMemberStatus, default: TeamMemberStatus.ACTIVE })
  status: TeamMemberStatus;

  @Column({ type: 'varchar', length: 50, nullable: true })
  created_by_role: string;

  

   @ManyToMany(() => Branch)
  @JoinTable({
    name: 'team_member_branches',
    joinColumn: { name: 'team_member_id', referencedColumnName: 'team_id' },
    inverseJoinColumn: { name: 'branch_id', referencedColumnName: 'branch_id' },
  })
  branches: Branch[];


   @ManyToOne(() => Branch, { nullable: true })
  @JoinColumn({ name: 'primary_branch_id' })
  primary_branch: Branch;



  @OneToMany(() => User, (user) => user.team)
  users: User[];

//   @ManyToOne(() => User)
// @JoinColumn({ name: 'user_id' })
// user: User;



}
