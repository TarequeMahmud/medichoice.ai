import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class MinimalUserDto {
  @Expose()
  id: string;

  @Expose()
  full_name: string;

  @Expose()
  email: string;
}

@Exclude()
export class AppointmentResponseDto {
  @Expose()
  id: string;

  @Expose()
  scheduled_time: Date;

  @Expose()
  status: string;

  @Expose()
  admin_approved: boolean;

  @Expose()
  reason: string;

  @Expose()
  created_at: Date;

  @Expose()
  clinic: string;

  @Expose()
  updated_at: Date;

  @Expose()
  @Type(() => MinimalUserDto)
  patient: MinimalUserDto;

  @Expose()
  @Type(() => MinimalUserDto)
  doctor: MinimalUserDto;
}
