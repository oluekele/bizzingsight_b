import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Kpi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('float')
  value: number;

  @Column()
  date: Date;
}
