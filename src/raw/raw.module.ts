import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSupply } from '../product-supplies/entities/product-supply.entity';
import { Supply } from './entities/supply.entity';
import { RawService } from './raw.service';
import { RawController } from './raw.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Supply, ProductSupply]), AuthModule],
  controllers: [RawController],
  providers: [RawService],
})
export class RawModule {}
