import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSupply } from '../product-supplies/entities/product-supply.entity';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductSupply])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
