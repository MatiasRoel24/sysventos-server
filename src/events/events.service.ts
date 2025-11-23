import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

/**
 * Servicio para gestionar eventos
 */
@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) { }

  /**
   * Crear un nuevo evento
   * @param createEventDto - Datos del evento
   * @returns Event - Evento creado
   */
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const { name, startDate, endDate } = createEventDto;

    // Validar fechas
    this.validateEventDates(new Date(startDate), new Date(endDate));

    // Validar nombre único
    const normalizedName = name.toLowerCase().trim();
    const existingEvent = await this.findByName(normalizedName);

    if (existingEvent && existingEvent.isActive) {
      throw new BadRequestException(
        `Ya existe un evento activo con el nombre "${name}"`,
      );
    }

    const event = this.eventRepository.create({
      name: normalizedName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    return this.eventRepository.save(event);
  }

  /**
   * Listar todos los eventos con paginación
   * @param paginationDto - Parámetros de paginación
   * @returns Event[] - Array de eventos
   */
  async findAll(paginationDto: PaginationDto): Promise<Event[]> {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.eventRepository.find({
      take: limit,
      skip: offset,
      order: { startDate: 'DESC' },
    });
  }

  /**
   * Listar solo eventos activos con paginación
   * @param paginationDto - Parámetros de paginación
   * @returns Event[] - Array de eventos activos
   */
  async findAllActive(paginationDto: PaginationDto): Promise<Event[]> {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.eventRepository.find({
      where: { isActive: true, isClosed: false },
      take: limit,
      skip: offset,
      order: { startDate: 'DESC' },
    });
  }

  /**
   * Obtener un evento por ID
   * @param id - UUID del evento
   * @returns Event - Evento encontrado
   */
  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException(`Evento con ID "${id}" no encontrado`);

    return event;
  }

  /**
   * Actualizar un evento por ID
   * @param id - UUID del evento
   * @param updateEventDto - Datos a actualizar
   * @returns Event - Evento actualizado
   */
  async update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.findOne(id);

    // No permitir modificar eventos cerrados
    if (event.isClosed) throw new BadRequestException('No se puede modificar un evento cerrado');

    // Validar fechas si se proporcionan
    if (updateEventDto.startDate || updateEventDto.endDate) {
      const newStartDate = updateEventDto.startDate
        ? new Date(updateEventDto.startDate)
        : event.startDate;
      const newEndDate = updateEventDto.endDate
        ? new Date(updateEventDto.endDate)
        : event.endDate;

      this.validateEventDates(newStartDate, newEndDate);
    }

    // Validar nombre único si se modifica
    if (updateEventDto.name) {
      const normalizedName = updateEventDto.name.toLowerCase().trim();

      const existingEvent = await this.eventRepository.findOne({
        where: { name: normalizedName },
      });

      if (existingEvent && existingEvent.id !== id && existingEvent.isActive) 
        throw new BadRequestException(`Ya existe un evento activo con el nombre "${updateEventDto.name}"`);
      
      updateEventDto.name = normalizedName;
    }

    // Convertir fechas a Date si vienen como string
    if (updateEventDto.startDate) updateEventDto.startDate = new Date(updateEventDto.startDate) as any;
    if (updateEventDto.endDate) updateEventDto.endDate = new Date(updateEventDto.endDate) as any;

    Object.assign(event, updateEventDto);
    return this.eventRepository.save(event);
  }

  /**
   * Eliminar lógicamente un evento
   * @param id - UUID del evento
   * @returns Event - Evento desactivado
   */
  async remove(id: string): Promise<Event> {
    const event = await this.findOne(id);

    if (!event.isActive) throw new BadRequestException('El evento ya está desactivado');
    if (event.isClosed) throw new BadRequestException('No se puede eliminar un evento cerrado');

    event.isActive = false;
    return this.eventRepository.save(event);
  }

  /**
   * Activar un evento
   * @param id - UUID del evento
   * @returns Event - Evento activado
   */
  async activate(id: string): Promise<Event> {
    const event = await this.findOne(id);

    if (event.isActive) throw new BadRequestException('El evento ya está activo');
    if (event.isClosed) throw new BadRequestException('No se puede activar un evento cerrado');

    event.isActive = true;
    return this.eventRepository.save(event);
  }

  /**
   * Desactivar un evento
   * @param id - UUID del evento
   * @returns Event - Evento desactivado
   */
  async deactivate(id: string): Promise<Event> {
    const event = await this.findOne(id);

    if (!event.isActive) throw new BadRequestException('El evento ya está desactivado');
    if (event.isClosed) throw new BadRequestException('No se puede desactivar un evento cerrado (ya está cerrado)');

    event.isActive = false;
    return this.eventRepository.save(event);
  }

  /**
   * Cerrar un evento (finalizado, no modificable)
   * @param id - UUID del evento
   * @returns Event - Evento cerrado
   */
  async close(id: string): Promise<Event> {
    const event = await this.findOne(id);

    if (event.isClosed) throw new BadRequestException('El evento ya está cerrado');

    // Cerrar evento implica desactivarlo también
    event.isClosed = true;
    event.isActive = false;

    return this.eventRepository.save(event);
  }

  /**
   * Obtener estadísticas básicas del evento
   * @param id - UUID del evento
   * @returns Object - Estadísticas del evento
   */
  async getStats(id: string): Promise<any> {
    const event = await this.findOne(id);

    // TODO: Implementar cuando existan los módulos Orders y Sales
    // Por ahora retorna estructura básica
    return {
      event: {
        id: event.id,
        name: event.name,
        startDate: event.startDate,
        endDate: event.endDate,
        isActive: event.isActive,
        isClosed: event.isClosed,
      },
      stats: {
        totalOrders: 0,
        totalSales: 0,
        totalRevenue: 0,
        // Se completará cuando existan Orders y Sales
      },
    };
  }

  /**
   * Buscar evento por nombre
   * @param name - Nombre normalizado
   * @returns Event | null
   */
  private async findByName(name: string): Promise<Event | null> {
    return this.eventRepository.findOne({
      where: { name: name.toLowerCase().trim() },
    });
  }

  /**
   * Validar que startDate sea anterior a endDate
   * @param startDate - Fecha de inicio
   * @param endDate - Fecha de fin
   */
  private validateEventDates(startDate: Date, endDate: Date): void {
    if (startDate >= endDate) throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
  }
}
