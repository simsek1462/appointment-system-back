import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { GetAvailableSlotsDto } from './dto/get-available-slots.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly service: AppointmentService) {}
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Get('available-slots')
  getAvailable(
    @Query('doctorId') doctorId: string,
    @Query('date') date: string,
  ) {
    return this.service.getAvailableSlots({
      doctorId: Number(doctorId),
      date,
    });
  }
  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.service.create(dto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.service.update(Number(id), dto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
