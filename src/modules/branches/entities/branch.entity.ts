import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
