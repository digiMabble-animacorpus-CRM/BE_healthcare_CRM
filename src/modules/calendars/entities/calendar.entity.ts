// src/modules/calendars/entities/calendar.entity.ts

import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'calendars' })
export class Calendar {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text', nullable: true })
  label: string;

  @Column({ type: 'text', nullable: true })
  siteid: string;

  @Column({ type: 'text', nullable: true })
  ownerid: string;
}