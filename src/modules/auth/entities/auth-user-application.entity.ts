import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { AuthUser } from './auth-user.entity';
import { AuthApplication } from './auth-application.entity';

export enum UserApplicationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface UserPermissions {
  read: boolean;
  write: boolean;
  delete: boolean;
  admin?: boolean;
}

@Entity('auth_user_applications')
@Index(['user_id'])
@Index(['app_id'])
@Index(['status'])
@Index(['user_id', 'app_id'], { unique: true })
export class AuthUserApplication {
  @PrimaryGeneratedColumn()
  user_app_id: number;

  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'int' })
  app_id: number;

  @Column({ type: 'varchar', length: 50, default: 'user' })
  role: string;

  @Column({ type: 'jsonb', nullable: true })
  permissions?: UserPermissions;

  @Column({
    type: 'enum',
    enum: UserApplicationStatus,
    default: UserApplicationStatus.ACTIVE,
  })
  status: UserApplicationStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  granted_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  expires_date?: Date;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

  @Column({ type: 'int', nullable: true })
  created_by?: number;

  @Column({ type: 'int', nullable: true })
  updated_by?: number;

  // Relations
  @ManyToOne(() => AuthUser, (user) => user.userApplications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: AuthUser;

  @ManyToOne(() => AuthApplication, (app) => app.userApplications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'app_id' })
  application: AuthApplication;
}
