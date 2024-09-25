import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Airdrop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  signature: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
