import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

@Entity('therapists')
export class Therapist {
  @PrimaryGeneratedColumn({ name: '_key', type: 'int' })
  _key: number;

  @Column({ name: 'id_pro', type: 'integer', nullable: true })
  idPro: number;

  @Column({ name: 'photo', type: 'text', nullable: true })
  photo: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255, nullable: true })
  lastName: string;

  @Column({ name: 'first_name', type: 'varchar', length: 255, nullable: true })
  firstName: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255, nullable: true })
  fullName: string;

  @Column({ name: 'job_title', type: 'varchar', length: 255, nullable: true })
  jobTitle: string;

  @Column({ name: 'target_audience', type: 'text', nullable: true })
  targetAudience: string;

  @Column({ name: 'specialization_1', type: 'varchar', length: 255, nullable: true })
  specialization1: string;

  @Column({ name: 'about_me', type: 'text', nullable: true })
  aboutMe: string;

  @Column({ name: 'consultations', type: 'text', nullable: true })
  consultations: string;

  @Column({ name: 'center_address', type: 'text', nullable: true })
  centerAddress: string;

  @Column({ name: 'center_email', type: 'varchar', length: 255, nullable: true })
  centerEmail: string;

  @Column({ name: 'center_phone_number', type: 'varchar', length: 20, nullable: true })
  centerPhoneNumber: string;

  @Column({ name: 'contact_email', type: 'varchar', length: 255, nullable: true })
  contactEmail: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 20, nullable: true })
  contactPhone: string;

  @Column({ name: 'schedule', type: 'text', nullable: true })
  schedule: string;

  @Column({ name: 'about', type: 'text', nullable: true })
  about: string;

  @Column({ name: 'spoken_languages', type: 'text', nullable: true })
  spokenLanguages: string;

  @Column({ name: 'payment_methods', type: 'text', nullable: true })
  paymentMethods: string;

  @Column({ name: 'degrees_and_training', type: 'text', nullable: true })
  degreesAndTraining: string;

  @Column({ name: 'specializations', type: 'text', nullable: true })
  specializations: string;

  @Column({ name: 'website', type: 'varchar', length: 255, nullable: true })
  website: string;

  @Column({ name: 'faq', type: 'text', nullable: true })
  faq: string;

  @Column({ name: 'agenda_links', type: 'text', nullable: true })
  agendaLinks: string;

  @Column({ name: 'imported_table_2', type: 'text', nullable: true })
  importedTable2: string;

  @Column({ name: 'field_27', type: 'text', nullable: true })
  field27: string;

  @Column({ name: 'imported_table_2_2', type: 'text', nullable: true })
  importedTable2_2: string;

  @Column({ name: 'team_namur_1', type: 'text', nullable: true })
  teamNamur1: string;

  @Column({ name: 'imported_table_2_3', type: 'text', nullable: true })
  importedTable2_3: string;

  @Column({ name: 'team_namur_2', type: 'text', nullable: true })
  teamNamur2: string;

  @Column({ name: 'sites', type: 'text', nullable: true })
  sites: string;

  @Column({ name: 'availability', type: 'text', nullable: true })
  availability: string;

  @Column({ name: 'specialization_2', type: 'varchar', length: 255, nullable: true })
  specialization2: string;

  @Column({ name: 'rosa_link', type: 'varchar', length: 255, nullable: true })
  rosaLink: string;

  @Column({ name: 'google_agenda_link', type: 'varchar', length: 255, nullable: true })
  googleAgendaLink: string;

  @Column({ name: 'appointment_start', type: 'timestamp', nullable: true })
  appointmentStart: Date;

  @Column({ name: 'appointment_end', type: 'timestamp', nullable: true })
  appointmentEnd: Date;

  @Column({ name: 'appointment_alert', type: 'integer', nullable: true })
  appointmentAlert: number;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string;
}
