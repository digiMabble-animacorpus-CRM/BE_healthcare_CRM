import { Entity, Column, PrimaryGeneratedColumn ,ManyToOne, JoinColumn} from 'typeorm';
import { Therapist } from 'src/modules/therapist/entities/therapist.entity'; // adjust the path

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

 // Optional relation to Therapist
@ManyToOne(() => Therapist, { nullable: true })
@JoinColumn({ name: 'therapist_id' })
therapist?: Therapist;

@Column({ name:'therapist_id', type: 'int', nullable: true })
therapistId?: number;


  // Soft delete columns
  @Column({ default: false })
  is_delete: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
