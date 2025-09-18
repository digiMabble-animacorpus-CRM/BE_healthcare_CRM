import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('new_requests')
export class NewRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'boolean', default: false })
  is_for_child: boolean;

  @Column({ type: 'varchar', length: 150, nullable: true })
  child_name?: string;

  @Column({ type: 'int', nullable: true })
  child_age?: number;

  @Column({ type: 'varchar', length: 100 })
  location: string;

  @Column({ type: 'varchar', length: 100 })
  specialty: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'varchar', length: 100, default: '' })
  first_name: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  last_name: string;
}
