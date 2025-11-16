import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventInventory } from './entities/event-inventory.entity';
import { EventSupplyInventory } from './entities/event-supply-inventory.entity';
import { InventoriesService } from './inventories.service';
import { InventoriesController } from './inventories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EventInventory, EventSupplyInventory])],
  controllers: [InventoriesController],
  providers: [InventoriesService],
})
export class InventoriesModule {}
