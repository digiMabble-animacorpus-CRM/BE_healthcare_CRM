import { BaseModel } from 'src/core/database/BaseModel';
import { Address } from 'src/modules/addresses/entities/address.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'customers' })
export class Customer extends BaseModel {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 15 })
  number: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // @Column({ type: 'varchar', length: 20, nullable: true })
  // zipCode?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  language?: string;

  @Column('simple-array', { nullable: true })
  tags?: string[];

  // @Column({ type: 'varchar', length: 50, nullable: true })
  // city?: string;

  // @Column({ type: 'varchar', length: 50, nullable: true })
  // country?: string;

  @Column({
    type: 'enum',
    enum: ['new', 'old'],
    default: 'new',
  })
  status: 'new' | 'old';

  @Column({ type: 'timestamp', nullable: true })
  lastUpdated?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  branch?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  source?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender?: string;

  @Column({ type: 'date', nullable: true })
  dob?: Date;

  // Use relation instead of plain string for address
  @ManyToOne(() => Address, { nullable: false, cascade: true, eager: true })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customer_image_url?: string;



  //   @Column({ type: 'int', nullable: true, default: 0 })
  // view_properties: number;

  // @Column({ type: 'int', nullable: true, default: 0 })
  // own_properties: number;

  // @Column({ type: 'float', nullable: true, default: 0 })
  // invest_property: number;

}
