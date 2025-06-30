import { BaseModel } from 'src/core/database/BaseModel';
import { Address } from 'src/modules/addresses/entities/address.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'customers' })
export class Customer extends BaseModel {
  @Column({ type: 'varchar', length: 100 })
  customer_name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 15 })
  phone_number: string;

  @Column({ type: 'int', nullable: true, default: 0 })
  view_properties: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  own_properties: number;

  @Column({ type: 'float', nullable: true, default: 0 })
  invest_property: number;

  @ManyToOne(() => Address, { nullable: false, cascade: true, eager: true })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customer_image_url?: string;

}