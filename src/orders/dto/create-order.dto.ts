import { IsArray, IsUUID } from "class-validator";

export class CreateOrderDto {

    @IsArray()
    readonly products: any;
}
