import {
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
    MinLength,
} from 'class-validator';

/**
 * DTO para crear un nuevo insumo (Supply)
 */
export class CreateSupplyDto {
    /**
     * Nombre del insumo
     * @type string
     * Requerido, mínimo 3 caracteres
     */
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    /**
     * Unidad de medida del insumo
     * @type string
     * Ejemplos: kg, litros, unidades
     */
    @IsString()
    @IsNotEmpty()
    unit: string;

    /**
     * Costo del insumo
     * @type number
     * Debe ser mayor a 0
     */
    @IsNumber()
    @IsPositive()
    cost: number;
}
