import { BaseModel } from 'src/core/database/BaseModel';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import Property from 'src/modules/properties/entities/property.entity';
import { Patient } from 'src/modules/customers/entities/customer.entity';

@Entity({ name: 'orders' })
export default class Order extends BaseModel {
  @Column({ type: 'int', unique: true })
  order_id: number;

  @ManyToOne(() => Patient, { nullable: false, eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Patient;

  @ManyToOne(() => Property, { nullable: false, eager: true })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column({ type: 'date' })
  purchase_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 10 })
  currency: string;

  @Column({ type: 'varchar', default: 'Pending' })
  amount_status: string;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;
}