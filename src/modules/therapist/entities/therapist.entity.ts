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
  idPro: number;  // keep nullable (number should allow null)

  @Column({ name: 'photo', type: 'text', default: '' })
  photo: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255, default: '' })
  lastName: string;

  @Column({ name: 'first_name', type: 'varchar', length: 255, default: '' })
  firstName: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255, default: '' })
  fullName: string;

  @Column({ name: 'job_title', type: 'varchar', length: 255, default: '' })
  jobTitle: string;

  @Column({ name: 'target_audience', type: 'text', default: '' })
  targetAudience: string;

  @Column({ name: 'specialization_1', type: 'varchar', length: 255, default: '' })
  specialization1: string;

  @Column({ name: 'about_me', type: 'text', default: '' })
  aboutMe: string;

  @Column({ name: 'consultations', type: 'text', default: '' })
  consultations: string;

  @Column({ name: 'center_address', type: 'text', default: '' })
  centerAddress: string;

  @Column({ name: 'center_email', type: 'varchar', length: 255, default: '' })
  centerEmail: string;

  @Column({ name: 'center_phone_number', type: 'varchar', length: 20, default: '' })
  centerPhoneNumber: string;

  @Column({ name: 'contact_email', type: 'varchar', length: 255, default: '' })
  contactEmail: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 20, default: '' })
  contactPhone: string;

  @Column({ name: 'schedule', type: 'text', default: '' })
  schedule: string;

  @Column({ name: 'about', type: 'text', default: '' })
  about: string;

  @Column({ name: 'spoken_languages', type: 'text', default: '' })
  spokenLanguages: string;

  @Column({ name: 'payment_methods', type: 'text', default: '' })
  paymentMethods: string;

  @Column({ name: 'degrees_and_training', type: 'text', default: '' })
  degreesAndTraining: string;

  @Column({ name: 'specializations', type: 'text', default: '' })
  specializations: string;

  @Column({ name: 'website', type: 'varchar', length: 255, default: '' })
  website: string;

  @Column({ name: 'faq', type: 'text', default: '' })
  faq: string;

  @Column({ name: 'agenda_links', type: 'text', default: '' })
  agendaLinks: string;

  @Column({ name: 'imported_table_2', type: 'text', default: '' })
  importedTable2: string;

  @Column({ name: 'field_27', type: 'text', default: '' })
  field27: string;

  @Column({ name: 'imported_table_2_2', type: 'text', default: '' })
  importedTable2_2: string;

  @Column({ name: 'team_namur_1', type: 'text', default: '' })
  teamNamur1: string;

  @Column({ name: 'imported_table_2_3', type: 'text', default: '' })
  importedTable2_3: string;

  @Column({ name: 'team_namur_2', type: 'text', default: '' })
  teamNamur2: string;

  @Column({ name: 'sites', type: 'text', default: '' })
  sites: string;

  @Column({ name: 'availability', type: 'text', default: '' })
  availability: string;

  @Column({ name: 'specialization_2', type: 'varchar', length: 255, default: '' })
  specialization2: string;

  @Column({ name: 'rosa_link', type: 'varchar', length: 255, default: '' })
  rosaLink: string;

  @Column({ name: 'google_agenda_link', type: 'varchar', length: 255, default: '' })
  googleAgendaLink: string;

  @Column({ name: 'appointment_start', type: 'timestamp', nullable: true })
  appointmentStart: Date; // keep nullable

  @Column({ name: 'appointment_end', type: 'timestamp', nullable: true })
  appointmentEnd: Date; // keep nullable

  @Column({ name: 'appointment_alert', type: 'integer', nullable: true })
  appointmentAlert: number; // keep nullable

  @Column({ name: 'image_url', type: 'text', default: '' })
  imageUrl: string;

  //  Soft delete fields
  @Column({ name: 'is_delete', type: 'boolean', default: false })
  is_delete: boolean;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
