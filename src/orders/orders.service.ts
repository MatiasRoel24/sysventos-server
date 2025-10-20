import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { v4 as uuid } from 'uuid'

@Injectable()
export class OrdersService {

  private orders = [
  {
    "id": uuid(),
    "products": [
      {
        "id": uuid(),
        "name": "Hamburguesa",
        "category": "comida",
        "qty": 2
      },
      {
        "id": uuid(),
        "name": "Vaso de Coca",
        "category": "bebida",
        "qty": 2
      }
    ]
  }
  ]

  create(order: CreateOrderDto) {
    const newOrder = {
      id: uuid(),
      ...order 
    }
    this.orders.push(newOrder);
    return this.orders;
  }

  findAll() {
    return this.orders;
  }

  findOne(id: string) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
