// data-source.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { DBconfig } from './src/config';
import { Patient } from './src/modules/customers/entities/patient.entity';
import { Address } from './src/modules/addresses/entities/address.entity';
import { Therapist } from './src/modules/therapist/entities/therapist.entity';
import { Staff } from './src/modules/StaffType/entities/staff.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import User from 'src/modules/users/entities/user.entity';
import { SocialLinks } from 'src/modules/social-links/entities/social-links.entity';
import { Menu } from 'src/modules/menus/entities/menu.entity';
import { Branch } from 'src/modules/branches/entities/branch.entity';
import { Token } from 'src/modules/users/entities/token.entity';
// import any other entities

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DBconfig.host,
  port: DBconfig.port,
  username: DBconfig.username,
  password: DBconfig.password,
  database: DBconfig.database,
  entities: [
    Patient,
    Address,
    Therapist,
    Staff,
    Role,
    Permission,
    User,
    SocialLinks,
    Menu,
    Branch,
    Token,
    // `${__dirname}/src/modules/**/entities/*.entity{.ts,.js}`
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
  ssl: DBconfig.ssl,
});
