import { Entity, Column, PrimaryGeneratedColumn ,ManyToOne, JoinColumn ,CreateDateColumn ,RelationId} from 'typeorm';
import { Therapist } from 'src/modules/therapist/entities/therapist.entity';
import { TherapistMember } from 'src/modules/therapists-team/entities/therapist-team.entity';
import { AppLanguage } from 'src/modules/languages/entities/app-languages.entity';

@Entity({ name: 'patients' })
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  firstname: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middlename?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastname?: string;

  @Column({ type: 'text', nullable: true, default: '' })
  ssin?: string;

  @Column({ type: 'text', nullable: true, default: '' })
  legalgender?: string;

  @Column({ name: 'language', type: 'int', nullable: true })
  languageId?: number;

  @ManyToOne(() => AppLanguage, { nullable: true })
  @JoinColumn({ name: 'language' })
  language?: AppLanguage;

  //  date cannot have default: ''
  //  allow null if unknown
  @Column({ type: 'date', nullable: true })
  birthdate?: Date | null;

  @Column({ type: 'text', nullable: true})
  primarypatientrecordid?: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({ type: 'text', nullable: true })
  status?: string;

  @Column({ type: 'text', nullable: true })
  mutualitynumber?: string;

  @Column({ type: 'text', nullable: false })
  rpnumber: string;

  @Column({ type: 'text', nullable: true })
  emails?: string;

  @Column({ type: 'text', nullable: true })
  country?: string;

  @Column({ type: 'text', nullable: true})
  city?: string;

  @Column({ type: 'text', nullable: true })
  street?: string;

 
  @Column('text', { array: true, nullable: false })
  phones: string[];

  @Column({ type: 'varchar', length: 20, nullable: true})
  zipcode?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  number?: string;

//  // Optional relation to Therapist
// @ManyToOne(() => Therapist, { nullable: true })
// @JoinColumn({ name: 'therapist_id' })
// therapist?: Therapist;

// @Column({ name:'therapist_id', type: 'int', nullable: true })
// therapistId?: number;

 @ManyToOne(() => TherapistMember, { nullable: true })
  @JoinColumn({ name: 'therapist_id' })
  therapist?: TherapistMember;

   @Column({ name: 'therapist_id', type: 'int', nullable: true })
  therapistId?: number;

@CreateDateColumn({ type: 'timestamp' })
created_at: Date;


  // Soft delete columns
  @Column({ default: false })
  is_delete: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
