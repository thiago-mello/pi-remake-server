import bcrypt from 'bcryptjs';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Team from './Team';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ name: 'birth_date', nullable: false })
  birthDate!: Date;

  @Column({ nullable: false })
  course!: string;

  @Column({ nullable: false, name: 'start_date' })
  startDate!: Date;

  @Column({ nullable: false, name: 'postal_code' })
  postalCode!: string;

  @Column({ nullable: false })
  address!: string;

  @Column({ nullable: false })
  phone!: string;

  @Column({ nullable: false })
  cpf!: string;

  @Column({ nullable: false })
  rg!: string;

  @Column({ default: false, name: 'is_active' })
  isActive!: boolean;

  password!: string;

  @Column({ name: 'password_hash', nullable: true })
  private passwordHash!: string;

  @Column({
    default: false,
    name: 'is_admin',
  })
  isAdmin!: boolean;

  @Column({
    default: false,
    name: 'confirmed_email',
  })
  confirmedEmail!: boolean;

  @ManyToOne(() => Team, (team) => team.users, { nullable: false })
  @JoinColumn({ name: 'team_id' })
  team!: Team;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.passwordHash = await bcrypt.hash(this.password, 12);
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    if (this.passwordHash) {
      return bcrypt.compare(password, this.passwordHash);
    }

    return false;
  }

  hasPassword(): boolean {
    if (this.passwordHash) {
      return true;
    }

    return false;
  }
}
