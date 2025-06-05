import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  PATIENT = 'patient',
}

@Entity()
export class Users {
  @ApiProperty({
    example: 'b3c8e1e2-9f3e-4c1a-8b2e-1e2f3a4b5c6d',
    description: 'Unique user ID',
  })
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @Column({ unique: true, nullable: false })
  email: string;

  @ApiProperty({
    example: 'hashedpassword123',
    description: 'Hashed user password',
  })
  @Column({ nullable: false, length: 128 })
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @Column({ nullable: false, length: 200 })
  full_name: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.PATIENT,
    description: 'Role of the user',
  })
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @ApiProperty({ example: false, description: 'Whether the user is verified' })
  @Column({ default: false })
  is_verified: boolean;

  @ApiProperty({
    example: '2024-06-01T12:00:00.000Z',
    description: 'Creation timestamp',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    example: '2024-06-01T12:00:00.000Z',
    description: 'Last update timestamp',
  })
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
