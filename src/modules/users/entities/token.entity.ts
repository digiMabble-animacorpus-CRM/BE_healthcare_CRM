// import {
//   Model,
//   DataType,
//   Sequelize,
//   Default,
//   Column,
//   PrimaryKey,
//   BelongsTo,
//   Table,
// } from 'sequelize-typescript';
// import BaseModel from '../../../core/database/BaseModel';

// @Table({ timestamps: true, tableName: 'otp',underscored:true,paranoid:true })
// export default class Otp extends BaseModel<Otp> {
//   @Column(DataType.STRING)
//   user: string;

//   @Column(DataType.STRING(6))
//   otp: string;

//   @Column(DataType.DATE)
//   expires_at: Date;

//   @Column(DataType.DATE)
//   created_at: Date;

// }

// src/modules/users/entities/token.entity.ts

import { Entity, Column } from 'typeorm';
import { BaseModel } from 'src/core/database/BaseModel';

@Entity({ name: 'tokens' })
export default class Token extends BaseModel {
  @Column({ type: 'varchar', length: 255 })
  user_email: string;

  @Column({ type: 'varchar', length: 500 })
  token: string;
  
  @Column({ type: 'varchar', length: 50 })
  type: string; // 'password_reset', 'email_verification', etc.

  @Column({ type: 'timestamp' })
  expires_at: Date;
}