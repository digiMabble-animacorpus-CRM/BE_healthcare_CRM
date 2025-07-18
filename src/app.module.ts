import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from 'nestjs-schedule';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBconfig } from './config';
import { JwtMiddleware } from './middleware/jwt.middleware';
import { config } from 'dotenv';
import { AddressesModule } from './modules/addresses/addresses.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { CompanyProfileModule } from './modules/company-profile/company-profile.module';
import { CustomersModule } from './modules/customers/customers.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AgentsModule } from './modules/agents/agents.module';
import { MenusModule } from './modules/menus/menus.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { LeadsModule } from './modules/leads/leads.module';
import { LocationModule } from './modules/location/location.module';
import { SocialLinks } from './modules/social-links/entities/social-links.entity';
config();

console.log('env--->', DBconfig.host, DBconfig.port, DBconfig.username, DBconfig.password, DBconfig.database);


@Module({ 
  imports: [
    TypeOrmModule.forRoot(
      {
          type: 'postgres',
          host: DBconfig.host,
          port: DBconfig.port,
          username: DBconfig.username,
          password: DBconfig.password,
          database: DBconfig.database,
          entities: [`${__dirname}../../**/**.entity{.ts,.js}`],
          synchronize: false,
          logging: true,
        }
    ),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MulterModule.register({
      dest: './uploads',
    }),
    AuthModule,
    UsersModule,
    AddressesModule,
    PropertiesModule,
    CompanyProfileModule,
    CustomersModule,
    OrdersModule,
    AgentsModule,
    MenusModule,
    PermissionsModule,
    RolesModule,
    LeadsModule,
    LocationModule,
    SocialLinks,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes('*');
  }
}