import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Users } from 'src/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tips')
export class Tips {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique ID of the health tip' })
  id: string;

  @Column()
  @ApiProperty({
    example: '5 Easy Ways to Reduce Stress',
    description: 'Tip title',
  })
  title: string;

  @Column('text')
  @ApiProperty({
    example: 'Take short walks, practice breathing...',
    description: 'Full content of the tip',
  })
  content: string;

  @ManyToOne(() => Users, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by' })
  @ApiProperty({
    description: 'Admin user who created the tip',
    type: () => Users,
  })
  created_by: Users;

  @CreateDateColumn()
  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;
}
