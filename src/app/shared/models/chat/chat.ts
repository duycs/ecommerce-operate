import { Timestamp } from '@angular/fire/firestore';
import { ProfileUser } from './user-profile';

export interface MyChat {
  chats: Chat[];
  unreadCount: number;
}

export interface Chat {
  id: string;
  lastMessage?: string;
  lastMessageDate: Date & Timestamp;
  userIds: string[];
  users: ProfileUser[];

  // Not stored, only for display
  chatPic?: string;
  chatName?: string;
  readed?: boolean; // readed with currentUser
  type: string; // image, text
}

export interface Message {
  text: string;
  senderId: string;
  senderName: string;
  sentDate: Date & Timestamp;
}