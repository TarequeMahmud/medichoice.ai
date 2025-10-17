import { Exclude, Expose, Type } from 'class-transformer';
import { MinimalUserDto } from 'src/appointments/dto/appointment-response.dto';
import { AppointmentResponseDto } from 'src/appointments/dto/appointment-response.dto';

@Exclude()
export class RecordResponseDto {
    @Expose()
    id: string;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    prescription: string[];

    @Expose()
    attachments?: string[];

    @Expose()
    created_at: Date;

    @Expose()
    updated_at: Date;

    @Expose()
    @Type(() => MinimalUserDto)
    patient: MinimalUserDto;

    @Expose()
    @Type(() => MinimalUserDto)
    doctor: MinimalUserDto;

    @Expose()
    @Type(() => AppointmentResponseDto)
    appointment: AppointmentResponseDto;
}
