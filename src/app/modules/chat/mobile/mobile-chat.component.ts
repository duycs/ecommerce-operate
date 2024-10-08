import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { of, first, Observable, take, from } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ChatsService } from 'src/app/services/chats.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SendPopupComponent } from 'src/app/shared/components/chat/send-popup/send-popup.component';
import { Chat, Message } from 'src/app/shared/models/chat/chat';
import { ProfileUser } from 'src/app/shared/models/chat/user-profile';
import { environment } from 'src/environments/environment';
import { Camera, CameraResultType } from '@capacitor/camera';
import { SendImageCameraPopupComponent } from 'src/app/shared/components/chat/send-image-camera-popup/send-image-camera-popup.component';

@Component({
  selector: 'app-mobile-chat',
  templateUrl: './mobile-chat.component.html',
  styleUrls: ['./mobile-chat.component.scss'],
})
export class MobileChatComponent implements OnInit, AfterViewInit {
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

  action = 'many';
  moreAction = false;
  images: any[] = [];
  progress = 10;

  cameraImageSrc!: any;

  private numberChange = 0;

  constructor(
    private activeRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private chatsService: ChatsService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngAfterViewInit(): void {
    this.messageControl.valueChanges.subscribe((value: any) => {
      if (!value || value == '') {
        this.action = 'many';
      } else {
        this.action = 'text';
      }
    });
  }

  ngOnInit(): void {
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
      this.initChatWithAdmin(chatId, firstAdmin?.displayName ?? '', firstAdmin?.photoURL ?? '');
    }

    return of(chatId);
  }

  getUpdateChatUsers(currentUser: ProfileUser, users: ProfileUser[], readed: boolean = false) {
    let userIds = [currentUser?.uid];
    this.adminUsers.forEach((u: any) => {
      u.readed = readed;
      userIds.push(u.uid);
    });

    if (currentUser) {
      currentUser.readed = readed;

      users.push(currentUser);
    }

    let data = {
      users: users,
      userIds: userIds
    }

    console.log("getUpdateChatUsers", data);
    return data;
  }

  initChatWithAdmin(chatId: string, name: string, chatPic: string) {
    this.admin.chatId = chatId;
    this.admin.name = name;
    this.admin.chatPic = chatPic;

    this.chatsService.getChatMessages(chatId).subscribe(messages => {
      //console.log("messages", messages, chatId);
      this.messages = messages;

      this.scrollToBottom();
    }
    );
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
      this.chatsService.getChat(selectedChatId).pipe(first()).subscribe((currentChat: any) => {
        users = currentChat.users.map((u: any) => {
          if (u.uid === this.currentUser.uid) {
            updateReaded = true;
            u.readed = true;
          }
          return u;
        }) as ProfileUser[];

        if (updateReaded) {
          from(this.chatsService.readedChatMessage(selectedChatId, users));
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

    this.action = 'text';
    this.moreAction = false;

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
    this.chatsService.getChat(chatId).pipe(first()).subscribe((currentChat: any) => {
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

      if (updateReaded) {
        from(this.chatsService.readedChatMessage(chatId, users));
      }

    });
  }

  scrollSmoothToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'auto' });
      }
    }, 200);
  }

  close(friend: any) {
    this.outCloseInbox.emit(friend);
  }

  open(friend: any) {
    this.outOpenInbox.emit(friend);
  }

  sendMedia(friend: any, message: any) {

    console.log(friend, message);

    if (!friend || !friend.chatId) {
      console.log("friend not found");
      return;
    }

    this.moreAction = false;
    let selectedChatId = friend.chatId;

    if (message && message !== "" && selectedChatId) {
      from(this.chatsService.addChatMessage(selectedChatId, message));
      this.readedAfterSendChat(selectedChatId);
      this.scrollSmoothToBottom();
    }
  }

  uploadImages = (friend: any, files: any) => {
    if (files.length === 0) {
      return;
    }

    let message = '';
    let limitTotal = 10;
    let limit = 10;

    // if (!this.uploadType || this.uploadType === 0) {
    //     this.message = "Chưa cấu hình kiểu upload file";
    //     this.alertService.showToastMessage(this.message);
    // }

    // validate limit files
    // if (files.length > limit) {
    //     message = `Giới hạn tải lên ${limit} ảnh`;
    //     this.alertService.showToastMessage(message);
    //     return;
    // }

    // if (limitTotal > 0 && limitTotal >= limit) {
    //     message = `Giới hạn tổng số tải lên ${limit} ảnh`;
    //     this.alertService.showToastMessage(message);
    //     return;
    // }

    const dialogRef = this.dialog.open(SendPopupComponent, {
      data: { type: 'files', files: files, screen: 'mobile' },
      width: '100%',
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);

      if (result) {
        let urls = result.data?.urls;
        let message = '';

        if (urls.length > 0) {
          for (let i = 0; i < urls.length; ++i) {
            message = `<img style="height: 300px; width: auto;" src="${urls[i]}">`;
          }
        }

        if (result.data.message && result.data.message !== '') {
          message = `${message}<br><span class = "image-message" style = "width: 100%; float: left">${result.data.message}</span>`
        }

        console.log(message);

        this.sendMedia(friend, message);
      }
    });
  }

  uploadFiles = (friend: any, files: any) => {
    if (files.length === 0) {
      return;
    }

    let message = '';
    let limitTotal = 10;
    let limit = 10;

    // if (!this.uploadType || this.uploadType === 0) {
    //     this.message = "Chưa cấu hình kiểu upload file";
    //     this.alertService.showToastMessage(this.message);
    // }

    // validate limit files
    // if (files.length > limit) {
    //     message = `Giới hạn tải lên ${limit} ảnh`;
    //     this.alertService.showToastMessage(message);
    //     return;
    // }

    // if (limitTotal > 0 && limitTotal >= limit) {
    //     message = `Giới hạn tổng số tải lên ${limit} ảnh`;
    //     this.alertService.showToastMessage(message);
    //     return;
    // }

    const dialogRef = this.dialog.open(SendPopupComponent, {
      data: { type: 'files', files: files, screen: 'mobile' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);

      if (result) {
        let urls = result.data?.urls;
        let message = '';

        if (urls.length > 0) {
          for (let i = 0; i < urls.length; ++i) {
            message = `<a class="hover-pointer no-underline chat-box" target="_blank" href="${urls[i]}"><span>${urls[i]}</span></a>`;
          }
        }

        if (result.data.message && result.data.message !== '') {
          message = `${message}<br><span class = "image-message" style = "width: 100%; float: left">${result.data.message}</span>`
        }

        console.log(message);

        this.sendMedia(friend, message);
      }
    });
  }

  clickMoreActions() {
    this.moreAction = !this.moreAction;
  }

  async takePicture(admin: any) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    const imageUrl = image.webPath;
    this.cameraImageSrc = imageUrl;

    const dialogRef = this.dialog.open(SendPopupComponent, {
      data: { type: 'files', files: imageUrl, screen: 'mobile' },
      width: '100%',
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);

      if (result) {
        let urls = result.data?.urls;
        let message = '';

        if (urls.length > 0) {
          for (let i = 0; i < urls.length; ++i) {
            message = `<img style="height: 300px; width: auto;" src="${urls[i]}">`;
          }
        }

        if (result.data.message && result.data.message !== '') {
          message = `${message}<br><span class = "image-message" style = "width: 100%; float: left">${result.data.message}</span>`
        }

        console.log(message);

        this.sendMedia(admin, message);
      }
    });

  };

}
