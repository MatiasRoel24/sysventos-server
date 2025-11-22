import {
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
    MinLength,
} from 'class-validator';

/**
 * DTO para crear un nuevo producto
 */
export class CreateProductDto {
    /**
     * Nombre del producto
     * @type string
     * Requerido, mínimo 3 caracteres
     */
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    /**
     * Costo base del producto
     * @type number
     * Debe ser mayor a 0
     */
    @IsNumber()
    @IsPositive()
    cost: number;
}
