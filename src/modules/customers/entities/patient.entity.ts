import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'patients' })
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false, default: '' })
  firstname: string;

  @Column({ type: 'varchar', length: 100, nullable: false, default: '' })
  middlename: string;

  @Column({ type: 'varchar', length: 100, nullable: false, default: '' })
  lastname: string;

  @Column({ type: 'text', nullable: false, default: '' })
  ssin: string;

  @Column({ type: 'text', nullable: false, default: '' })
  legalgender: string;

  @Column({ type: 'text', nullable: false, default: '' })
  language: string;

  //  date cannot have default: ''
  //  allow null if unknown
  @Column({ type: 'date', nullable: true })
  birthdate: Date | null;

  @Column({ type: 'text', nullable: false, default: '' })
  primarypatientrecordid: string;

  @Column({ type: 'text', nullable: false, default: '' })
  note: string;

  @Column({ type: 'text', nullable: false, default: '' })
  status: string;

  @Column({ type: 'text', nullable: false, default: '' })
  mutualitynumber: string;

  @Column({ type: 'text', nullable: false, default: '' })
  mutualityregistrationnumber: string;

  @Column({ type: 'text', nullable: false, default: '' })
  emails: string;

  @Column({ type: 'text', nullable: false, default: '' })
  country: string;

  @Column({ type: 'text', nullable: false, default: '' })
  city: string;

  @Column({ type: 'text', nullable: false, default: '' })
  street: string;

  // arrays don’t support default: ''
  // keep nullable true
  @Column('text', { array: true, nullable: true })
  phones: string[];

  @Column({ type: 'varchar', length: 20, nullable: false, default: '' })
  zipcode: string;

  @Column({ type: 'varchar', length: 20, nullable: false, default: '' })
  number: string;

  // Soft delete columns
  @Column({ default: false })
  is_delete: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
