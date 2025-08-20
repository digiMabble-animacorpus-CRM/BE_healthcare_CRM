// // src/modules/agents/agents.module.ts
// import { Module, forwardRef } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AgentsService } from './agents.service';
// import { AgentsController } from './agents.controller';
// import { SocialLinks } from '../social-links/entities/social-links.entity';
// import { AuthModule } from '../auth/auth.module';
// import { AddressesModule } from '../addresses/addresses.module'; 
// import User from '../users/entities/user.entity';
// import Property from '../properties/entities/property.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([User, SocialLinks, Property]),
//     AddressesModule,                                 
//     forwardRef(() => AuthModule),
//   ],
//   controllers: [AgentsController],
//   providers: [AgentsService],
//   exports: [AgentsService],
// })
// export class AgentsModule {}
