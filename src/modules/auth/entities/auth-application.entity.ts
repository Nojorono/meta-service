import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { AuthUserApplication } from './auth-user-application.entity';

export enum ApplicationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

@Entity('auth_applications')
@Index(['app_code'])
@Index(['status'])
export class AuthApplication {
  @PrimaryGeneratedColumn()
  app_id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  app_code: string;

  @Column({ type: 'varchar', length: 100 })
  app_name: string;

  @Column({ type: 'text', nullable: true })
  app_description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  app_url?: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.ACTIVE,
  })
  status: ApplicationStatus;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

  @Column({ type: 'int', nullable: true })
  created_by?: number;

  @Column({ type: 'int', nullable: true })
  updated_by?: number;

  // Relations
  @OneToMany(() => AuthUserApplication, (userApp) => userApp.application)
  userApplications: AuthUserApplication[];
}
