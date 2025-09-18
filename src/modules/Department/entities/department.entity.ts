import { Entity, PrimaryGeneratedColumn, Column,OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Therapist } from 'src/modules/therapist/entities/therapist.entity'; // adjust the path

@Entity({ name: 'departments' })
export class Department {
    @ApiProperty({ example: 1, description: 'Unique identifier of the department' })
   @PrimaryGeneratedColumn() 
  id: number;

  @ApiProperty({ example: 'Cardiology', description: 'Name of the department' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

   @ApiProperty({ example: true, description: 'Whether the department is active' })
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ default: false })
is_deleted: boolean;


  @ApiProperty({ example: 'Handles heart-related treatments', required: false })
  @Column({ type: 'text', nullable: true })
  description: string | null;


  @OneToMany(() => Therapist, (therapist) => therapist.department)
therapists: Therapist[];

}
