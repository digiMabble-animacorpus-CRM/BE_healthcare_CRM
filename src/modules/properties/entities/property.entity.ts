// src/modules/properties/entities/property.entity.ts

import { BaseModel } from 'src/core/database/BaseModel';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'properties' })
export default class Property extends BaseModel {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  category: number;

  @Column({ type: 'varchar', nullable: false })
  listing_type: string;

  @Column({ type: 'int', default: 0 })
  bedrooms: number;

  @Column({ type: 'int', default: 0 })
  bathrooms: number;

  @Column({ type: 'int', default: 0 })
  square_foot: number;

  @Column({ type: 'int', default: 0 })
  floor: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'int', nullable: true })
  address_id: number;

  @Column({ type: 'varchar', nullable: true })
  image: string;

}
