import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { FamilyResolver } from './family.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entities/family.entity';
import { MessageFamily } from 'src/message/entities/message-family.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Family, MessageFamily, User]),
    AuthModule,
  ],
  providers: [FamilyResolver, FamilyService],
  exports: [FamilyService],
})
export class FamilyModule {}
