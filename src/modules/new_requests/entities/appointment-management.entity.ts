import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('appointment_management')
export class AppointmentManagement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  action: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  therapist_name?: string;

  @Column({ type: 'date' })
  appointment_date: Date;

  @Column({ type: 'time' })
  appointment_time: string;

  @Column({ type: 'date', nullable: true })
  preferred_new_date?: Date;

  @Column({ type: 'time', nullable: true })
  preferred_new_time?: string;

  @Column({ type: 'varchar', length: 100 })
  location: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'varchar', length: 100, default: '' })
  first_name: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  last_name: string;
}
