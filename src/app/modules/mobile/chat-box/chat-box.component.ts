import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, first, Observable, take, from } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ChatsService } from 'src/app/services/chats.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Chat, Message } from 'src/app/shared/models/chat/chat';
import { ProfileUser } from 'src/app/shared/models/chat/user-profile';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit, AfterViewInit {
  @ViewChild('endOfChat') endOfChat!: ElementRef;
  adminUsers = environment.firebase.adminUsers;
  admin: any = null;
  showHeader = false;
  friend: any;
  currentUser: any = {};
  @Output() outCloseInbox: any = new EventEmitter;
  @Output() outOpenInbox: any = new EventEmitter;
  chat$: Observable<Chat> | undefined;

  messageControl = new FormControl('');
  messages$: Observable<Message[]> | undefined;
  messages!: Message[];
  createOnce = 0;
  pleaseMessage = false;

  private numberChange = 0;

  constructor(
    private activeRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private chatsService: ChatsService,
    private router: Router,
  ) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    console.log("here");

    let userId = this.activeRoute.snapshot.queryParamMap.get('id');
    let name = this.activeRoute.snapshot.queryParamMap.get('name');
    let logout = this.activeRoute.snapshot.queryParamMap.get('logout');

    if (logout && logout !== '') {
      this.firebaseService.logout();
      console.log("logout");
    } else {
      if (userId && userId !== '') {
        from(this.authenFireBase(userId, name ?? ''));
      }
    }
  }

  async authenFireBase(userId: string, name: string) {
    let phone = userId;
    let email = userId + environment.firebase.defaultSuffixEmail;
    let password = environment.firebase.defaultPassword;

    this.currentUser = await this.firebaseService.createIfNotExistThenLoginFirebase(email, password, name, phone);

    if (this.currentUser) {
      await this.createChat(this.currentUser.uid, this.adminUsers);
    }
    else {
      throw new Error("Authen firebase error");
    }
  }

  async createChat(currentUserUid: any, adminUsers: ProfileUser[]) {
    let firstAdmin = adminUsers[0];

    let userIds = [currentUserUid, firstAdmin.uid];
    let chatId = await this.chatsService.isExistingChat(userIds);
    this.admin = {};

    if (!chatId) {
      // not exist chat then create new chat user to admin
      console.log("not exist chat then create new chat user to admin", this.currentUser);

      let newChatId = await this.chatsService.createChat(firstAdmin);
      console.log("newChatId", newChatId);
      var updateUsers = this.getUpdateChatUsers(this.currentUser, adminUsers);
      await this.chatsService.updateUsersChat(newChatId, updateUsers.userIds, updateUsers.users);
      this.initChatWithAdmin(newChatId ?? '', firstAdmin?.displayName ?? '', firstAdmin?.photoURL ?? '');

      this.pleaseMessage = true;
    } else {
      // exist chat then only init user
      console.log("exist chat then only init user", chatId);
      var updateUsers = this.getUpdateChatUsers(this.currentUser, adminUsers);
      await this.chatsService.updateUsersChat(chatId, updateUsers.userIds, updateUsers.users);
      this.initChatWithAdmin(chatId, firstAdmin?.displayName ?? '', firstAdmin?.photoURL ?? '');
    }

    return of(chatId);
  }

  getUpdateChatUsers(currentUser: ProfileUser, users: ProfileUser[]) {
    let userIds = [currentUser?.uid];
    this.adminUsers.forEach(u => {
      userIds.push(u.uid);
    });

    if (currentUser) {
      users.push(currentUser);
    }

    let data = {
      users: users,
      userIds: userIds
    }

    return data;
  }

  initChatWithAdmin(chatId: string, name: string, chatPic: string) {
    this.admin.chatId = chatId;
    this.admin.name = name;
    this.admin.chatPic = chatPic;

    this.chatsService.getChatMessages(chatId).subscribe(messages => {
      console.log("messages", messages, chatId);
      this.messages = messages;

      this.scrollToBottom();
    });
  }

  clickAsReaded(friend: any) {
    if (!friend || !friend.chatId) {
      console.log("friend not found");
      return;
    }

    let selectedChatId = friend.chatId;
    const message = this.messageControl.value;

    if (selectedChatId && message === "") {
      let updateReaded = false;
      let users!: any;
      this.chatsService.getChat(selectedChatId).subscribe({
        next: currentChat => {
          users = currentChat.users.map((u: any) => {
            if (u.uid === this.currentUser.uid) {
              updateReaded = true;
              u.readed = true;
            }
            return u;
          }) as ProfileUser[];
        },
        error: err => console.error('An error occurred', err),
        complete: () => {
          if (updateReaded) {
            from(this.chatsService.readedChatMessage(selectedChatId, users));
          }
        }
      });
    }
  }

  sendMessage(friend: any) {
    console.log('sendMessage', friend);

    if (!friend || !friend.chatId) {
      console.log("friend not found");
      return;
    }

    const message = this.messageControl.value;
    let selectedChatId = friend.chatId;

    if (message && message !== "" && selectedChatId) {

      from(this.chatsService.addChatMessage(selectedChatId, message));

      this.messageControl.setValue('');

      this.readedAfterSendChat(selectedChatId);

      this.scrollToBottom();
    }
  }

  readedAfterSendChat(chatId: any) {
    let updateReaded = false;
    let users!: any;
    this.chatsService.getChat(chatId).subscribe({
      next: async currentChat => {
        // other user is not read, current user readed
        users = currentChat.users.map((u: any) => {
          if (u.uid != this.currentUser.uid) {
            updateReaded = true;
            u.readed = false;
          }

          if (u.uid === this.currentUser.uid) {
            updateReaded = true;
            u.readed = true;
          }

          return u;
        }) as ProfileUser[];
      },
      error: err => console.error('An error occurred', err),
      complete: () => {
        if (updateReaded) {
          from(this.chatsService.readedChatMessage(chatId, users));
        }
      }
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  }

  close(friend: any) {
    this.outCloseInbox.emit(friend);
  }

  open(friend: any) {
    this.outOpenInbox.emit(friend);
  }
}
