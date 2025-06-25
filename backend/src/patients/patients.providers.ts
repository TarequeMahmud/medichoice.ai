import { DataSource } from 'typeorm';
import { Patients } from './entities/patient.entity';

export const patientProviders = [
  {
    provide: 'PATIENT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Patients),
    inject: ['DATA_SOURCE'],
  },
];
