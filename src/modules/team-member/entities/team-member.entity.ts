import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column({ type: 'jsonb', nullable: false, default: {} })
  schedule: object;

  @Column({ type: 'text', nullable: false, default: '' })
  about: string;

  @Column({ type: 'text', array: true, nullable: false, default: '{}' })
  languages_spoken: string[];

  @Column({ type: 'text', array: true, nullable: false, default: '{}' })
  payment_methods: string[];

  @Column({ type: 'text', array: true, nullable: false, default: '{}' })
  diplomas_and_training: string[];

  @Column({ type: 'text', array: true, nullable: false, default: '{}' })
  specializations: string[];

  @Column({ type: 'varchar', length: 255, nullable: false, default: '' })
  website: string;

  @Column({ type: 'jsonb', nullable: false, default: {} })
  frequently_asked_questions: object;

  @Column({ type: 'text', array: true, nullable: false, default: '{}' })
  calendar_links: string[];

  @Column({ type: 'varchar', length: 255, nullable: false, default: '' })
  photo: string;

  @Column({ type: 'boolean', default: false })
  is_delete: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
