import { BaseModel } from 'src/core/database/BaseModel';
import { Patient } from 'src/modules/customers/entities/patient.entity';
import Property from 'src/modules/properties/entities/property.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

export enum LeadSource {
  WEBSITE = 'Website',
  REFERRAL = 'Referral',
  CAMPAIGN = 'Campaign',
  WALK_IN = 'Walk-in',
  SOCIAL_MEDIA = 'Social Media',
  PHONE_CALL = 'Phone Call',
  EMAIL = 'Email'
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  PROPOSAL_SENT = 'Proposal Sent',
  NEGOTIATION = 'Negotiation',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost',
  FOLLOW_UP = 'Follow Up'
}

@Entity({ name: 'leads' })
export class Lead extends BaseModel {
  @Column({
    type: 'enum',
    enum: LeadSource,
    default: LeadSource.WEBSITE
  })
  lead_source: LeadSource;

  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NEW
  })
  lead_status: LeadStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  budget_range: number;

  @Column({ type: 'time', nullable: true })
  preferred_contact_time: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'date' })
  date_of_inquiry: Date;

  @ManyToOne(() => Patient, { nullable: false, eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Patient;

  @ManyToOne(() => Property, { nullable: false, eager: true })
  @JoinColumn({ name: 'property_id' })
  interested_property: Property;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;
}
