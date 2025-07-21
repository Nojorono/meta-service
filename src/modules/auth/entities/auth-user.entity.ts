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

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

@Entity('auth_users')
@Index(['username'])
@Index(['email'])
@Index(['status'])
export class AuthUser {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'varchar', length: 200 })
  full_name: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login_date?: Date;

  @Column({ type: 'int', nullable: true })
  created_by?: number;

  @Column({ type: 'int', nullable: true })
  updated_by?: number;

  // Relations
  @OneToMany(() => AuthUserApplication, (userApp) => userApp.user)
  userApplications: AuthUserApplication[];
}
