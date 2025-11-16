import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSupply } from '../product-supplies/entities/product-supply.entity';
import { Supply } from './entities/supply.entity';
import { RawService } from './raw.service';
import { RawController } from './raw.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Supply, ProductSupply])],
  controllers: [RawController],
  providers: [RawService],
})
export class RawModule {}
