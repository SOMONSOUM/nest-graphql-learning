import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAuth } from './entities/user-auth.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FamilyModule } from 'src/family/family.module';
import { FamilyPediaModule } from 'src/family-pedia/family-pedia.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAuth]),
    AuthModule,
    FamilyModule,
    FamilyPediaModule,
  ],
  providers: [UserResolver, UserService],
})
export class UserModule {}
