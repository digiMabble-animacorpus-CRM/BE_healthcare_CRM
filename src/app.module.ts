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
// import { CompanyProfileModule } from './modules/company-profile/company-profile.module';
import { PatientsModule } from './modules/customers/patient.module';
import { OrdersModule } from './modules/orders/orders.module';
// import { AgentsModule } from './modules/agents/agents.module';
import { MenusModule } from './modules/menus/menus.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { LeadsModule } from './modules/leads/leads.module';
import { LocationModule } from './modules/location/location.module';
import { SocialLinks } from './modules/social-links/entities/social-links.entity';
import { TherapistsModule } from './modules/therapist/therapists.module';
// import { StaffModule } from './modules/StaffType/staff.module';
import { SeederModule } from './seeds/seeder.module';
// import { FirebaseModule } from './core/database/config/firebase/firebase.module';
import { TokenModule } from './modules/users/token.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { TeamMemberModule } from './modules/team-member/team-member.module';
import { AppointmentsModule } from './modules/appointment/appointment.module';
import { CalendarsModule } from './modules/calendars/calendars.module';
import { SpecializationModule } from './modules/specialization/specialization.module';
import { BranchesModule } from './modules/branches/branches.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { ProfileModule } from './modules/profile/profile.module';
import { DepartmentsModule } from './modules/Department/departments.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { RolesGuard } from './common/guards/roles.guard';
import { ChatBotHistoryModule } from './modules/chat-bot-history/chat-bot-history.module';
import { NewRequestsModule } from './modules/new_requests/new-requests.module';
import { TherapistTeamModule } from './modules/therapists-team/therapist-team.module';
import { AppLanguagesModule } from './modules/languages/app-languages.module';
import { RosaTokenModule } from './modules/rosa-token/rosa-token.module';


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
          ssl: {rejectUnauthorized: false},
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
    // CompanyProfileModule,
    PatientsModule,
    OrdersModule,
    // AgentsModule,
    MenusModule,
    PermissionsModule,
    RolesModule,
    LeadsModule,
    LocationModule,
    SocialLinks,
    TherapistsModule,
    // StaffModule,
    SeederModule,
    TokenModule,
    TeamMemberModule,
    AppointmentsModule,
    CalendarsModule,
    SpecializationModule,
    BranchesModule,
    // ConsultationsModule,
    ProfileModule,
    DepartmentsModule,
    DashboardModule,
    ChatBotHistoryModule,
    NewRequestsModule,
    TherapistTeamModule,
    AppLanguagesModule,
    RosaTokenModule
  ],
  controllers: [AppController],
  providers: [AppService,
      {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, 
    },
      {
      provide: APP_GUARD,
      useClass: RolesGuard, 
    },
  ],

})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes('*');
  }
}
