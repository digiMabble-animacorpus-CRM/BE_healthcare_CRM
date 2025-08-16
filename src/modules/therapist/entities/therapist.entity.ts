import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from 'src/core/database/BaseModel';
import { Address } from 'src/modules/addresses/entities/address.entity';

@Entity({ name: 'therapists' })
export class Therapist extends BaseModel {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 15 })
  number: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Address, { cascade: true, eager: true, nullable: false })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Column({ type: 'varchar', length: 20, nullable: true })
  zipCode: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  language: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  specialization: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  experience: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  education: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  registrationNumber: string;

  @Column({ type: 'jsonb', nullable: true })
  certificationFiles: {
    path: string;
    preview: string | null;
    formattedSize: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  availability: {
    day: string;
    from: string;
    to: string;
  }[];

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: 'active' | 'inactive';

  @Column({ type: 'timestamp', nullable: true })
  lastUpdated: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  source: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  branch: 'Gembloux - Orneau' | 'Gembloux - Tout Vent' | 'Anima Corpus Namur';
}
