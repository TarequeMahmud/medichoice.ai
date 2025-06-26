import { DataSource } from 'typeorm';
import { Appointments } from './entities/appointment.entity';

export const appointmentProviders = [
  {
    provide: 'APPOINTMENT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Appointments),
    inject: ['DATA_SOURCE'],
  },
];
