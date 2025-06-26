import { DataSource } from 'typeorm';
import { Records } from './entities/record.entity';

export const recordProviders = [
  {
    provide: 'RECORD_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Records),
    inject: ['DATA_SOURCE'],
  },
];
