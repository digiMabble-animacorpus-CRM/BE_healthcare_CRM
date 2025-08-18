import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('team_member_list')
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  team_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  last_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  first_name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  full_name: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  job_1: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  specific_audience: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  specialization_1: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  job_2: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  job_3: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  job_4: string;

  @Column({ type: 'text', nullable: true })
  who_am_i: string;

  @Column({ type: 'text', nullable: true })
  consultations: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  office_address: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  contact_email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contact_phone: string;

  @Column({ type: 'jsonb', nullable: true })
  schedule: object;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ type: 'text', array: true, nullable: true })
  languages_spoken: string[];

  @Column({ type: 'text', array: true, nullable: true })
  payment_methods: string[];

  @Column({ type: 'text', array: true, nullable: true })
  diplomas_and_training: string[];

  @Column({ type: 'text', array: true, nullable: true })
  specializations: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

  @Column({ type: 'jsonb', nullable: true })
  frequently_asked_questions: object;

  @Column({ type: 'text', array: true, nullable: true })
  calendar_links: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  photo: string;
}
