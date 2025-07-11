import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Users } from 'src/users/entities/user.entity';
import { Appointments } from 'src/appointments/entities/appointment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('messages')
export class Messages {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique ID for the message' })
  id: string;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  @ApiProperty({ description: 'Sender of the message', type: () => Users })
  sender: Users;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiver_id' })
  @ApiProperty({ description: 'Receiver of the message', type: () => Users })
  receiver: Users;

  @Column('text')
  @ApiProperty({
    description: 'Text content of the message',
    example: 'Hi doctor, can I reschedule?',
  })
  message: string;

  @Column()
  @ApiProperty({
    description: 'Room ID based on doctor and patient combination',
    example: 'uuid-d1-uuid-p1',
  })
  room: string;

  @CreateDateColumn({ name: 'sent_at', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: 'When the message was sent',
    example: '2025-06-23T12:00:00Z',
  })
  sent_at: Date;
}
