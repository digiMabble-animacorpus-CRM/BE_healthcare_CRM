import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany,JoinTable } from 'typeorm';
import { Department } from 'src/modules/Department/entities/department.entity'; // adjust the path
import { Language } from 'src/modules/language/entities/language.entity'; // adjust the path
import { Branch } from 'src/modules/branches/entities/branch.entity'; // adjust the path
import { Specialization } from 'src/modules/specialization/entities/specialization.entity';


@Entity('therapists')
export class Therapist {
  @PrimaryGeneratedColumn({ name: 'therapist_id', type: 'int' })
  therapistId: number;

  @Column({ name: 'first_name', type: 'varchar', length: 100, nullable: false })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: false })
  lastName: string;

  @Column({
    name: 'full_name',
    type: 'varchar',
    length: 200,
    generatedType: 'STORED',
    asExpression: "first_name || ' ' || last_name",
    nullable: false,
  })
  fullName: string;

  @Column({ name: 'photo', type: 'text', default: '' })
  photo: string;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string;

  @Column({ name: 'contact_email', type: 'varchar', length: 255, nullable: false })
  contactEmail: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 20, nullable: false })
  contactPhone: string;

  @Column({ name: 'about_me', type: 'text', default: '' })
  aboutMe: string;

  @Column({ name: 'degrees_training', type: 'text', default: '' })
  degreesTraining: string;

  @Column({ name: 'inami_number', type: 'bigint', nullable: false })
  inamiNumber: number;

  @Column({ name: 'payment_methods', type: 'jsonb', default: () => "'[]'::jsonb" })
  paymentMethods: any;

  @Column({ name: 'faq', type: 'text', default: '' })
  faq: string;

  @Column({ name: 'department_id', type: 'int', nullable: false })
  departmentId: number;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

   // <-- Many-to-Many with Specialization
  @ManyToMany(() => Specialization, { cascade: true })
  @JoinTable({
    name: 'therapist_specializations',
    joinColumn: { name: 'therapist_id', referencedColumnName: 'therapistId' },
    inverseJoinColumn: { name: 'specialization_id', referencedColumnName: 'specialization_id' },
  })
  specializations: Specialization[];




    @ManyToMany(() => Language, (language) => language.therapists, { cascade: true })
  @JoinTable({
    name: 'therapist_languages',
    joinColumn: { name: 'therapist_id', referencedColumnName: 'therapistId' },
    inverseJoinColumn: { name: 'language_id', referencedColumnName: 'id' },
  })
  languages: Language[];

  @ManyToMany(() => Branch, { cascade: true })
@JoinTable({
  name: 'therapist_branches',
  joinColumn: { name: 'therapist_id', referencedColumnName: 'therapistId' },
  inverseJoinColumn: { name: 'branch_id', referencedColumnName: 'branch_id' },
})
branches: Branch[];


  // <-- availability as JSON array directly
  @Column({ name: 'availability', type: 'jsonb', default: () => "'[]'::jsonb" })
  availability: { day: string; startTime: string; endTime: string }[];


  @Column({ name: 'is_delete', type: 'boolean', default: false })
  isDelete: boolean;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

}
