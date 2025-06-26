import { DataSource } from 'typeorm';
import { Doctors } from './entities/doctor.entity';

export const doctorProviders = [
  {
    provide: 'DOCTOR_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Doctors),
    inject: ['DATA_SOURCE'],
  },
];
