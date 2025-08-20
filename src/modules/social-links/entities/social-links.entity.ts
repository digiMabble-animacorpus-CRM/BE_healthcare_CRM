// src/modules/agents/entities/social-links.entity.ts

import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseModel } from 'src/core/database/BaseModel';
import User from 'src/modules/users/entities/user.entity';

@Entity({ name: 'social_links' })
export class SocialLinks extends BaseModel {
  @Column({ type: 'varchar', nullable: true })
  facebook: string;

  @Column({ type: 'varchar', nullable: true })
  instagram: string;

  @Column({ type: 'varchar', nullable: true })
  twitter: string;

  // @OneToOne(() => User, (user) => user.social_links)
  // @JoinColumn()
  // user: User;
}
