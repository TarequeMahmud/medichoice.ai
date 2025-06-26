import { DataSource } from 'typeorm';
import { Tips } from './entities/tip.entity';

export const tipProviders = [
  {
    provide: 'TIP_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Tips),
    inject: ['DATA_SOURCE'],
  },
];
