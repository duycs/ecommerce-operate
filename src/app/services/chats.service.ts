import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { concatMap, first, from, map, Observable, take, tap } from 'rxjs';
import { Chat, MyChat, Message } from '../shared/models/chat/chat';
import { ProfileUser } from '../shared/models/chat/user-profile';
import { FirebaseService } from './firebase.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../core/authentication/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {

  currentUser!: any;
  myChat!: any;

  constructor(
    private firestore: Firestore,
    private firebaseService: FirebaseService,
    private authService: AuthService,
  ) {
    this.getCurrentUserChats().subscribe(myChat => {
      this.myChat = myChat;
    });
  }

  getChatWithAdmins(adminUids: any[]): Observable<MyChat> {
    let currentUser = this.firebaseService.getFirebaseAccount();

    const ref = collection(this.firestore, 'chats');
    const myQuery = query(
      ref,
      where('userIds', 'array-contains-any', adminUids)
    );
    return collectionData(myQuery, { idField: 'id' }).pipe(
      map((chats: any) => this.mappingMyChatWithAdmin(currentUser?.uid, chats))
    ) as Observable<MyChat>;
  }

  getChats(userUid: any): Observable<MyChat> {
    const ref = collection(this.firestore, 'chats');
    const myQuery = query(
      ref,
      where('userIds', 'array-contains', userUid || '')
    );
    return collectionData(myQuery, { idField: 'id' }).pipe(
      map((chats: any) => this.mappingMyChatWithAdmin(userUid, chats))
    ) as Observable<MyChat>;
  }

  async getCurrentChats() {
    let currentUser = this.firebaseService.getFirebaseAccount();

    console.log("currentUser", currentUser);

    const ref = collection(this.firestore, 'chats');
    const myQuery = query(
      ref,
      where('userIds', 'array-contains', currentUser.uid)
    );

    const querySnapshot = await getDocs(myQuery);
    const chats = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    return chats;
  }


  getCurrentUserChats(): Observable<MyChat> {
    let currentUser = this.firebaseService.getFirebaseAccount();

    console.log("currentUser", currentUser);

    const ref = collection(this.firestore, 'chats');
    const myQuery = query(
      ref,
      where('userIds', 'array-contains', currentUser?.uid || '')
    );
    return collectionData(myQuery, { idField: 'id' }).pipe(
      map((chats: any) => this.mappingMyChatWithAdmin(currentUser?.uid, chats))
    ) as Observable<MyChat>;
  }

  async updateUsersChat(chatId: any, userIds: any[], users: ProfileUser[]) {
    const chatRef = doc(this.firestore, 'chats', chatId);
    return await updateDoc(chatRef, {
      userIds: userIds,
      users: users
    })
  }

  async createChat(otherUser: ProfileUser) {
    let currentUser = this.firebaseService.getFirebaseAccount();

    const ref = collection(this.firestore, 'chats');
    let docRef = await addDoc(ref, {
      userIds: [currentUser.uid, otherUser?.uid],
      users: [
        {
          uid: currentUser.uid ?? '',
          displayName: currentUser?.displayName ?? '',
          photoURL: currentUser?.photoURL ?? '',
          readed: true,
        },
        {
          uid: otherUser?.uid ?? '',
          displayName: otherUser.displayName ?? '',
          photoURL: otherUser.photoURL ?? '',
          readed: false
        },
      ],
    });

    return docRef.id;
  }

  async isExistingChat(userIds: any[]) {
    if (!userIds || userIds.length == 0) throw new Error;

    let chats = await this.getCurrentChats() as any;
    
    for (let i = 0; i < chats.length; i++) {

      // all userIds exist in any chat
      let existing = userIds.every((id: string) => chats[i].userIds.includes(id))
      if (existing) {
        console.log("existing chat", chats[i]);
        return chats[i].id;
      }
    }
  }

  async addChatMessage(chatId: string, message: string) {
    console.log("addChatMessage", chatId);

    let currentUser = this.firebaseService.getFirebaseAccount();

    const ref = collection(this.firestore, 'chats', chatId, 'messages');
    const chatRef = doc(this.firestore, 'chats', chatId);
    const today = Timestamp.fromDate(new Date());

    await addDoc(ref, {
      text: message,
      senderId: currentUser?.uid,
      senderName: currentUser?.displayName,
      sentDate: today,
    });

    await updateDoc(chatRef, { lastMessage: message, lastMessageDate: today })
  }

  async readedChatMessage(chatId: string, userData: ProfileUser[]) {
    console.log("readedChatMessage", chatId);

    const chatRef = doc(this.firestore, 'chats', chatId);
    await updateDoc(chatRef, { users: userData });
  }

  getChat(chatId: string): Observable<Chat> {
    const ref = doc(this.firestore, 'chats', chatId);
    return docData(ref) as Observable<Chat>;
  }

  getChatMessages(chatId: string): Observable<Message[]> {
    const ref = collection(this.firestore, 'chats', chatId, 'messages');
    const queryAll = query(ref, orderBy('sentDate', 'asc'));
    return collectionData(queryAll) as Observable<Message[]>;
  }

  mappingMyChatWithAdmin(currentUserId: string | undefined, chats: Chat[]): MyChat {
    const adminUsers = environment.firebase.adminUsers;
    const adminUserIds = adminUsers.map((u: any) => { return u.uid });

    chats.forEach((chat: Chat) => {
      const isAdmin = adminUsers.find((u: any) => { return chat.userIds.indexOf(u.uid) }) ?? true;
      const normalUserId = chat.userIds.filter(id => !adminUserIds.includes(id))[0];
      const normalUser = chat.users.filter(u => u.uid === normalUserId)[0];

      const currentUser = chat.users.filter(u => u.uid === currentUserId)[0];
      const otherUsers = chat.users.filter(u => u.uid !== currentUserId);

      let otherUserDisplayNames = '';
      let names = otherUsers.map(u => u.displayName);

      if (!isAdmin) {
        if (names && names.length < 4) {
          otherUserDisplayNames = names.join(", ");
        } else {
          otherUserDisplayNames = names.slice(0, 3).join(", ") + "...";
        }
      } else if (normalUser) {
        otherUserDisplayNames = "Admins, " + normalUser.displayName;
      }

      let displayName = isAdmin ? otherUserDisplayNames : (currentUser.displayName ?? '');

      chat.chatName = displayName;
      chat.chatPic = currentUser?.photoURL;
      chat.readed = currentUser?.readed;
    });

    let myChat = {
      chats: chats,
      unreadCount: chats.filter(c => !c.readed).length
    } as MyChat;

    return myChat;
  }

  getChatName(user: any, otherUsers: any[]) {
    const adminUsers = environment.firebase.adminUsers;
    const userIds = otherUsers.map(c => c.uid);
    const isAdmin = adminUsers.find((u: any) => { return userIds.indexOf(u.uid) }) ?? true;
    let names = otherUsers.map(u => u.displayName);
    let otherUserDisplayNames = '';

    if (!isAdmin) {
      if (names && names.length < 4) {
        otherUserDisplayNames = names.join(", ");
      } else {
        otherUserDisplayNames = names.slice(0, 3).join(", ") + "...";
      }
    } else {
      otherUserDisplayNames = "Admins, " + user.displayName;
    }

    let chatName = isAdmin ? otherUserDisplayNames : (user.displayName ?? '');
    return chatName;
  }

}
