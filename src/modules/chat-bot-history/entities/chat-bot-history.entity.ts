import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('new_chat_bot_history')
export class NewChatBotHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  session_id: string;

  // DB column is `message`, but entity property is `message_content`
  @Column({ name: 'message', type: 'jsonb' })
  message_content: any;

  @Column({ type: 'text', nullable: true })
  email: string | null;


   @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
