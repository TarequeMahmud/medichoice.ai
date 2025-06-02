import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  PATIENT = 'patient',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, length: 128 })
  password: string;

  @Column({ nullable: false, length: 200 })
  full_name: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
/*
users Table (Core Table)
Column	Type	Constraints
id	UUID / SERIAL	PK, unique
email	VARCHAR	unique, not null
password	VARCHAR	hashed, not null
full_name	VARCHAR	not null
role	ENUM	('admin', 'doctor', 'patient')
is_verified	BOOLEAN	default: false
created_at	TIMESTAMP	default: now()
updated_at	TIMESTAMP	auto-update
*/
