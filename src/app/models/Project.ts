import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './User';

@Entity()
export default class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false, type: 'float' })
  value!: number;

  @ManyToMany(() => User, { nullable: false })
  @JoinTable()
  members!: User[];

  @ManyToMany(() => User)
  @JoinTable()
  managers!: User[];

  @Column({ name: 'signature_date', nullable: false })
  signatureDate!: Date;

  @Column({ nullable: false })
  deadline!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
