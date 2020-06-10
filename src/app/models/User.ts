import bcrypt from 'bcryptjs';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Team from './Team';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
  })
  name!: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email!: string;

  password!: string;

  @Column({
    nullable: false,
    name: 'password_hash',
  })
  private passwordHash!: string;

  @Column({
    default: false,
    name: 'is_admin',
  })
  isAdmin!: boolean;

  @ManyToOne(() => Team, (team) => team.users, { nullable: false })
  @JoinColumn({ name: 'team_id' })
  team!: Team;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword(): Promise<void> {
    if (this.password) {
      this.passwordHash = await bcrypt.hash(this.password, 12);
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }
}
