import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { RawModule } from './raw/raw.module';
import { UsersModule } from './users/users.module';
import { SalesModule } from './sales/sales.module';
import { PaymentsModule } from './payments/payments.module';
import { RolesModule } from './roles/roles.module';
import { InventoriesModule } from './inventories/inventories.module';

@Module({
  imports: [EventsModule, ProductsModule, OrdersModule, RawModule, UsersModule, SalesModule, PaymentsModule, RolesModule, InventoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
