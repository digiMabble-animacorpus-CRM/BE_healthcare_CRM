import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Therapist } from 'src/modules/therapist/entities/therapist.entity'; // adjust the path

@Entity('languages')
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

    @ManyToMany(() => Therapist, (therapist) => therapist.languages)
  therapists: Therapist[];
}
