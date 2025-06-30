import { Entity, Column, ManyToMany, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseModel } from 'src/core/database/BaseModel';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('menus')
export class Menu extends BaseModel {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  path: string;

  @Column({ type: 'varchar', length: 50 })
  icon: string;

  @Column({ type: 'int', nullable: true })
  parent_id: number;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_visible: boolean;

  @ManyToOne(() => Menu, menu => menu.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Menu;

  @OneToMany(() => Menu, menu => menu.parent)
  children: Menu[];

  @ManyToMany(() => Permission, permission => permission.menus)
  permissions: Permission[];
}
