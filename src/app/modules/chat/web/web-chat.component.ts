import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from '@microsoft/signalr';
import {
  combineLatest,
  first,
  from,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { ChatsService } from 'src/app/services/chats.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Message } from 'src/app/shared/models/chat/chat';
import { ProfileUser } from 'src/app/shared/models/chat/user-profile';

@Component({
  selector: 'app-web-chat',
  templateUrl: './web-chat.component.html',
  styleUrls: ['./web-chat.component.css'],
})
export class WebChatComponent implements OnInit {
  @ViewChild('endOfChat') endOfChat!: ElementRef;

  constructor(
    private firebaseService: FirebaseService,
    private chatsService: ChatsService
  ) { }

  user$ = this.firebaseService.getCurrentUserProfile();
  currentUser!: any;
  myChat!: any;
  isSelected = false;
  selectedChatId!: any;
  selectedChat!: any;
  messages!: Message[];

  searchControl = new FormControl<any>('');
  messageControl = new FormControl<any>('');

  otherUsers$ = combineLatest([this.firebaseService.allUsers$, this.user$]).pipe(
    map(([users, user]) => users.filter((u) => u.uid !== user?.uid))
  );

  users$ = combineLatest([
    this.otherUsers$,
    this.searchControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([users, searchString]) => {
      return users.filter((u) =>
        u.displayName?.toLowerCase().includes(searchString != null ? searchString?.toLowerCase() : '')
      );
    })
  );

  ngOnInit(): void {
    this.currentUser = this.firebaseService.getFirebaseAccount();

    this.chatsService.getCurrentUserChats().subscribe(myChat => {
      this.myChat = myChat;
      console.log("chats", this.myChat);
    });

    this.selectedChatId(this.selectedChatId);
  }

  selectedChatWith(chatId: any) {
    if (chatId && chatId !== '') {
      this.myChat.chats.find((chat: any) => {
        if (chat.id === chatId) {
          this.isSelected = true;
          this.selectedChatId = chatId;
          this.selectedChat = chat;
          this.getMessages(chat.id);
          return true;
        }

        this.messageControl.setValue('');
        this.isSelected = false;
        return false;
      });
    }
  }

  getMessages(chatId: any) {
    this.chatsService.getChatMessages(chatId).subscribe((res: any) => {
      this.messages = res;

      this.scrollToBottom();
    });
  }

  async createChat(user: ProfileUser) {
    let chatId = await this.chatsService.isExistingChat([user.uid]);

    if (!chatId) {
      return await this.chatsService.createChat(user);
    } else {
      this.selectedChatWith(chatId);
      return chatId;
    }
  }

  openChat(chat: any) {
    this.selectedChatId = chat.id;
    this.selectedChatWith(chat.id);
    from(this.readedChat(chat, this.currentUser));
  }

  async readedChat(chat: any, currentUser: any) {
    let updateReaded = false;
    let users = chat.users.map((u: any) => {
      if (u.uid === currentUser?.uid) {
        updateReaded = true;
        u.readed = true;
      }
      return u;
    }) as ProfileUser[];

    if (updateReaded) {
      await this.chatsService.readedChatMessage(chat.id, users);
    }
  }

  sendMessage() {
    const message = this.messageControl.value;
    if (message && this.selectedChatId) {
      from(this.chatsService.addChatMessage(this.selectedChatId, message));
      this.messageControl.setValue('');

      this.scrollToBottom();
    }

    this.updateReadedChat(this.selectedChatId);
  }

  updateReadedChat(chatId: any) {
    let updateReaded = false;
    let users!: any;
    this.chatsService.getChat(chatId).pipe(first()).subscribe(
      (currentChat: any) => {

        // other user is not read, current user readed
        users = currentChat.users.map((u: any) => {
          if (u.uid != this.currentUser?.uid) {
            updateReaded = true;
            u.readed = false;
          }

          if (u.uid === this.currentUser?.uid) {
            updateReaded = true;
            u.readed = true;
          }

          return u;
        }) as ProfileUser[];

        if (updateReaded) {
          from(this.chatsService.readedChatMessage(chatId, users));
        }

      });
  }

  clickAsReaded() {
    const message = this.messageControl.value;

    console.log("clickAsReaded", this.selectedChatId)

    if (this.selectedChatId && message === "") {
      let updateReaded = false;
      let users!: any;
      this.chatsService.getChat(this.selectedChatId).pipe(first()).subscribe(
        (currentChat: any) => {
          users = currentChat.users.map((u: any) => {
            if (u.uid !== this.currentUser?.uid) {
              updateReaded = true;
              u.readed = false;
            }

            if (u.uid === this.currentUser?.uid) {
              updateReaded = true;
              u.readed = true;
            }
            return u;
          }) as ProfileUser[];

          console.log(updateReaded, this.currentUser, users);

          if (updateReaded) {
            from(this.chatsService.readedChatMessage(this.selectedChatId, users));
          }

        });
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  }
}
