// src/modules/function-description/entities/function-description.entity.ts

import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'function_description' })
export class FunctionDescription {
  @PrimaryColumn({ type: 'text' })
  fonction: string;

  @Column({ type: 'text', nullable: true })
  function_description: string;

  @Column({ type: 'text', nullable: true })
  simplification_description: string;

  @Column({ type: 'text', nullable: true })
  communication_patients: string;

  @Column({ type: 'text', nullable: true })
  tone_communication: string;

  @Column({ type: 'text', nullable: true })
  professional_1: string;

  @Column({ type: 'text', nullable: true })
  professional_2: string;

  @Column({ type: 'text', nullable: true })
  professional_3: string;

  @Column({ type: 'text', nullable: true })
  professional_4: string;

  @Column({ type: 'text', nullable: true })
  professional_5: string;

  @Column({ type: 'text', nullable: true })
  professional_6: string;

  @Column({ type: 'text', nullable: true })
  professional_7: string;

  @Column({ type: 'text', nullable: true })
  professional_8: string;

  @Column({ type: 'text', nullable: true })
  professional_9: string;
}