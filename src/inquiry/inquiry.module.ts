import { Module } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { InquiryResolver } from './inquiry.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inquiry } from './entities/inquiry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inquiry])],
  providers: [InquiryResolver, InquiryService],
})
export class InquiryModule {}
