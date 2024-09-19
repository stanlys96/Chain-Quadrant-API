import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  public_key: string;

  @Column()
  private_key: string;

  @Column()
  reference_id: string;
}
