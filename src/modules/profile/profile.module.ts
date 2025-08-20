// profile.module.ts
import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthModule } from 'src/modules/auth/auth.module';   
import { UsersModule } from 'src/modules/users/users.module'; 
import  User  from 'src/modules/users/entities/user.entity';
@Module({
  imports: [
    AuthModule, 
    UsersModule,    
   TypeOrmModule.forFeature([User]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}



