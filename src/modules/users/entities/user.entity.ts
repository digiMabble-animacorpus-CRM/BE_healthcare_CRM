// import {
//   Table,
//   Column,
//   DataType,
//   Unique,
//   Default,
//   AllowNull,
//   BeforeCreate,
//   HasMany,
// } from 'sequelize-typescript';
// import { BaseModel } from 'src/core/database/BaseModel';
// import Encryption from 'src/core/utils/encryption';

// @Table({ timestamps: true, tableName: 'users', underscored: true, paranoid: true })
// export default class User extends BaseModel<User> {
//   @AllowNull(true)
//   @Column(DataType.STRING)
//   user_name: string;

//   @AllowNull(true)
//   @Column(DataType.STRING)
//   profile_url: string;

//   @AllowNull(true)
//   @Column(DataType.STRING)
//   email_id: string;

//   @Column({
//     type: DataType.STRING,
//     set(value: string) {
//       this.setDataValue(
//         'password',
//         value ? Encryption.hashPassword(value) : null,
//       );
//     },
//   })
//   password: string;

//   @AllowNull(true)
//   @Column({
//     type: DataType.STRING,
//   })
//   mobile_no: string;

//   @AllowNull(false)
//   @Default(false)
//   @Column(DataType.BOOLEAN)
//   email_verified: boolean;

//   @AllowNull(true)
//   @Column(DataType.STRING(15))
//   gender: string;

//   @AllowNull(true)
//   @Column(DataType.DATEONLY)
//   dob: Date;

//   @Column(DataType.DATE)
//   last_login: Date;

//   @AllowNull(true)
//   @Column(DataType.TEXT)
//   device_token: string;

//   @AllowNull(false)
//   @Default(false)
//   @Column(DataType.BOOLEAN)
//   is_blocked: boolean;

// }

// src/modules/users/entities/user.entity.ts

import { Entity, Column, BeforeInsert, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import Encryption from 'src/core/utils/encryption';
import { BaseModel } from 'src/core/database/BaseModel';
import { Exclude } from 'class-transformer';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Address } from 'src/modules/addresses/entities/address.entity';
import { SocialLinks } from 'src/modules/social-links/entities/social-links.entity';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { Staff } from 'src/modules/StaffType/entities/staff.entity';

@Entity({ name: 'users' })
export default class User extends BaseModel {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  profile_url: string;

  @Column({ type: 'varchar', unique: true })
  email_id: string;

  @Exclude()
  @Column({ type: 'varchar', select: true })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = Encryption.hashPassword(this.password);
    }
  }

  @Column({ type: 'varchar', nullable: true })
  mobile_no: string;

  @Column({ type: 'boolean', default: false })
  email_verified: boolean;

  @Column({ type: 'varchar', length: 15, nullable: true })
  gender: string;

  @Column({ type: 'varchar', length: 15, default: 'regular' })
  user_type: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  @Column({ type: 'text', nullable: true })
  device_token: string;

  @Column({ type: 'boolean', default: false })
  is_blocked: boolean;

  @Column({ type: 'text', array: true, default: () => 'ARRAY[]::text[]' })
  preferences: string[];

  @Column({ type: 'varchar', nullable: true })
  company_name: string;

  @Column({ type: 'varchar', nullable: true })
  website: string;

  @Column({ type: 'varchar', nullable: true })
  logo: string;

  @Column({ type: 'varchar', nullable: true })
  tax_id: string;

  @OneToOne(() => Address, { cascade: true, eager: false, nullable: true })
  @JoinColumn()
  address: Address;

  @OneToOne(() => SocialLinks, (socialLinks) => socialLinks.user, { cascade: true, eager: false, nullable: true })
  social_links: SocialLinks;

  
  @ManyToMany(() => Role, role => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
  })
  roles: Role[];

  @ManyToMany(() => Permission, (permission) => permission.users, { eager: true }) // Optional: eager loading
@JoinTable({
  name: 'user_permissions',
  joinColumn: { name: 'user_id', referencedColumnName: 'id' },
  inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
})
permissions: Permission[];

@OneToOne(() => Staff, (staff) => staff.user)
staff: Staff;


}

