import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';

/**
 * DTO para crear un nuevo pedido
 */
export class CreateOrderDto {
    @IsArray()
    @ArrayMinSize(1, { message: 'El pedido debe contener al menos un producto' })
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}
