import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('chat_bot_history')
export class ChatBotHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  session_id: string;

  @Column()
  message_type: string;

  @Column('text')
  message_content: string;

   @Column({ nullable: true })
  email: string;

  @CreateDateColumn()
  created_at: Date;
}
