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

import { Entity, Column, BeforeInsert, JoinColumn,ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import Encryption from 'src/core/utils/encryption';
import { BaseModel } from 'src/core/database/BaseModel';
import { Exclude } from 'class-transformer';
import { TeamMember } from 'src/modules/team-member/entities/team-member.entity';

import { Role } from 'src/modules/roles/entities/role.entity';
import { Address } from 'src/modules/addresses/entities/address.entity';
import { SocialLinks } from 'src/modules/social-links/entities/social-links.entity';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
// import { Staff } from 'src/modules/StaffType/entities/staff.entity';

@Entity({ name: 'users' })
export default class User  {

   @PrimaryGeneratedColumn('increment')
    id!: number;

  @Column({ type: 'varchar', unique: true })
  email_id: string;

  @Exclude()
  @Column({ type: 'varchar', select: true })
  password: string;

  @Column({ type: 'uuid' })
  team_id: string;
  
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = Encryption.hashPassword(this.password);
    }
  }


    // team_id foreign key
  @ManyToOne(() => TeamMember, (teamMember) => teamMember.users, { nullable: false })
  @JoinColumn({ name: 'team_id' })
  team: TeamMember;


  // @Column({ type: 'boolean', default: false })
  // email_verified: boolean;



  // @Column({ type: 'timestamp', nullable: true })
  // last_login: Date;

  // @Column({ type: 'text', nullable: true })
  // device_token: string;

  
  // @ManyToMany(() => Role, role => role.users)
  // @JoinTable({
  //   name: 'user_roles',
  //   joinColumn: { name: 'user_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
  // })
  // roles: Role[];

//   @ManyToMany(() => Permission, (permission) => permission.users, { eager: true }) // Optional: eager loading
// @JoinTable({
//   name: 'user_permissions',
//   joinColumn: { name: 'user_id', referencedColumnName: 'id' },
//   inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
// })
// permissions: Permission[];

// @OneToOne(() => Staff, (staff) => staff.user)
// staff: Staff;


}

