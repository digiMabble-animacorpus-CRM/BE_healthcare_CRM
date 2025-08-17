import { BaseModel } from 'src/core/database/BaseModel';
import { Entity, Column , PrimaryGeneratedColumn} from 'typeorm';

@Entity({ name: 'patients' })
export class Patient  {

    @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstname?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middlename?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastname?: string;

  @Column({ type: 'text', nullable: true })
  ssin?: string;

  @Column({ type: 'text', nullable: true })
  legalgender?: string;

  @Column({ type: 'text', nullable: true })
  language?: string;

  @Column({ type: 'date', nullable: true })
  birthdate?: Date;

  @Column({ type: 'text', nullable: true })
  primarypatientrecordid?: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({ type: 'text', nullable: true })
  status?: string;

  @Column({ type: 'text', nullable: true })
  mutualitynumber?: string;

  @Column({ type: 'text', nullable: true })
  mutualityregistrationnumber?: string;

  @Column({ type: 'text', nullable: true })
  emails?: string;

  @Column({ type: 'text', nullable: true })
  country?: string;

  @Column({ type: 'text', nullable: true })
  city?: string;

  @Column({ type: 'text', nullable: true })
  street?: string;

  @Column('text', { array: true, nullable: true })
  phones?: string[];

  @Column({ type: 'varchar', length: 20, nullable: true })
  zipcode?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  number?: string;
}
