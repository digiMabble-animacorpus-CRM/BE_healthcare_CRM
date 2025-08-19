// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   JoinColumn,
//   JoinTable,
//   ManyToMany,
//   ManyToOne,
//   OneToOne,
//   UpdateDateColumn,
//   OneToMany,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { BaseModel } from 'src/core/database/BaseModel';
// import { Address } from 'src/modules/addresses/entities/address.entity';
// import { Branch } from 'src/modules/branches/entities/branch.entity';
// import { Permission } from 'src/modules/permissions/entities/permission.entity';
// import { Role } from 'src/modules/roles/entities/role.entity';
// import  { Token }  from 'src/modules/users/entities/token.entity'; 
// import User from 'src/modules/users/entities/user.entity'; // Adjust the import path as necessary
// export enum AccessLevel {
//   STAFF = 'staff',
//   BRANCH_ADMIN = 'branch-admin',
//   SUPER_ADMIN = 'super-admin',
// }

// export enum Gender {
//   MALE = 'male',
//   FEMALE = 'female',
//   OTHER = 'other',
// }

// export enum Status {
//   ACTIVE = 'active',
//   INACTIVE = 'inactive',
// }

// export interface CertificationFile {
//   path: string;
//   preview: string | null;
//   formattedSize: string;
// }

// export interface AvailabilitySlot {
//   day: string;
//   from: string;
//   to: string;
// }

// export interface LoginDetails {
//   otpVerified: boolean;
//   lastLogin?: string;
//   loginCount?: number;
//   deviceInfo?: string;
// }

// @Entity('therapists')
// export class Staff {
// @PrimaryGeneratedColumn({ name: '_key', type: 'int' })
// _key: number;


//   @Column({ name: 'id_pro', type: 'integer', nullable: true })
//   idPro: number;

//   @Column({ name: 'photo', type: 'text', nullable: true })
//   photo: string;

//   @Column({ name: 'last_name', type: 'varchar', length: 255, nullable: true })
//   lastName: string;

//   @Column({ name: 'first_name', type: 'varchar', length: 255, nullable: true })
//   firstName: string;

//   @Column({ name: 'full_name', type: 'varchar', length: 255, nullable: true })
//   fullName: string;

//   @Column({ name: 'job_title', type: 'varchar', length: 255, nullable: true })
//   jobTitle: string;

//   @Column({ name: 'target_audience', type: 'text', nullable: true })
//   targetAudience: string;

//   @Column({ name: 'specialization_1', type: 'varchar', length: 255, nullable: true })
//   specialization1: string;

//   @Column({ name: 'about_me', type: 'text', nullable: true })
//   aboutMe: string;

//   @Column({ name: 'consultations', type: 'text', nullable: true })
//   consultations: string;

//   @Column({ name: 'center_address', type: 'text', nullable: true })
//   centerAddress: string;

//   @Column({ name: 'center_email', type: 'varchar', length: 255, nullable: true })
//   centerEmail: string;

//   @Column({ name: 'center_phone_number', type: 'varchar', length: 20, nullable: true })
//   centerPhoneNumber: string;

//   @Column({ name: 'contact_email', type: 'varchar', length: 255, nullable: true })
//   contactEmail: string;

//   @Column({ name: 'contact_phone', type: 'varchar', length: 20, nullable: true })
//   contactPhone: string;

//   @Column({ name: 'schedule', type: 'text', nullable: true })
//   schedule: string;

//   @Column({ name: 'about', type: 'text', nullable: true })
//   about: string;

//   @Column({ name: 'spoken_languages', type: 'text', nullable: true })
//   spokenLanguages: string;

//   @Column({ name: 'payment_methods', type: 'text', nullable: true })
//   paymentMethods: string;

//   @Column({ name: 'degrees_and_training', type: 'text', nullable: true })
//   degreesAndTraining: string;

//   @Column({ name: 'specializations', type: 'text', nullable: true })
//   specializations: string;

//   @Column({ name: 'website', type: 'varchar', length: 255, nullable: true })
//   website: string;

//   @Column({ name: 'faq', type: 'text', nullable: true })
//   faq: string;

//   @Column({ name: 'agenda_links', type: 'text', nullable: true })
//   agendaLinks: string;

//   @Column({ name: 'availability', type: 'text', nullable: true })
//   availability: string;

//   @Column({ name: 'specialization_2', type: 'varchar', length: 255, nullable: true })
//   specialization2: string;

//   @Column({ name: 'rosa_link', type: 'varchar', length: 255, nullable: true })
//   rosaLink: string;

//   @Column({ name: 'google_agenda_link', type: 'varchar', length: 255, nullable: true })
//   googleAgendaLink: string;

//   @Column({ name: 'appointment_start', type: 'timestamp', nullable: true })
//   appointmentStart: Date;

//   @Column({ name: 'appointment_end', type: 'timestamp', nullable: true })
//   appointmentEnd: Date;

//   @Column({ name: 'appointment_alert', type: 'integer', nullable: true })
//   appointmentAlert: number;

//   // === Relationships from your original Staff entity ===

//   // @OneToOne(() => Address, { cascade: true, eager: true })
//   // @JoinColumn({ name: 'address' })
//   // address: Address;

//   // @ManyToOne(() => Role, { eager: true })
//   // @JoinColumn({ name: 'roleId' })
//   // role: Role;

//   // @Column({ name: 'accessLevel', type: 'enum', enum: AccessLevel })
//   // accessLevel: string;

//   // @ManyToMany(() => Branch)
//   // @JoinTable({
//   //   name: 'staffBranches',
//   //   joinColumn: { name: 'staffId', referencedColumnName: 'id' },
//   //   inverseJoinColumn: { name: 'branchId', referencedColumnName: 'id' },
//   // })
//   // branches: Branch[];

//   // @ManyToOne(() => Branch, { eager: true })
//   // @JoinColumn({ name: 'selectedBranch' })
//   // selectedBranch: Branch;

//   // @ManyToMany(() => Permission, { eager: true })
//   // @JoinTable({
//   //   name: 'staffPermissions',
//   //   joinColumn: { name: 'staffId', referencedColumnName: 'id' },
//   //   inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' },
//   // })
//   // permissions: Permission[];

//   // @Column('jsonb', { name: 'certification_files', nullable: true })
//   // certificationFiles: CertificationFile[];

//   // @Column('jsonb', { name: 'login_details' })
//   // loginDetails: LoginDetails;

//   // @Column({ name: 'created_by' })
//   // createdBy: number;

//   // @Column({ name: 'updated_by', nullable: true })
//   // updatedBy: number;

//   // @OneToMany(() => Token, token => token.staff)
//   // tokens: Token[];

//   // @OneToOne(() => User, (user) => user.staff, {
//   //   cascade: true,
//   //   onDelete: 'CASCADE',
//   // })
//   // @JoinColumn({ name: 'user_id' })
//   // user: User;
// }
