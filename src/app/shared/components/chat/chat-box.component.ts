import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
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
import { PhotoService } from 'src/app/services/photo.service';
import { Chat, Message } from 'src/app/shared/models/chat/chat';
import { ProfileUser } from 'src/app/shared/models/chat/user-profile';
import { SendPopupComponent } from './send-popup/send-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit, AfterViewInit, OnChanges {
    @ViewChild('endOfChat') endOfChat!: ElementRef;
    @Input() friend: any;
    @Input() showHeader = true;
    @Output() outCloseInbox: any = new EventEmitter;
    @Output() outOpenInbox: any = new EventEmitter;
    currentUser!: any;
    action = 'many';
    moreAction = false;
    images: any[] = [];
    progress = 10;

    constructor(
        private firebaseService: FirebaseService,
        private chatsService: ChatsService,
        private photoService: PhotoService,
        private alertService: AlertService,
        private dialog: MatDialog,
    ) { }

    user$ = this.firebaseService.getCurrentUserProfile();
    chat$: Observable<Chat> | undefined;

    messageControl = new FormControl('');
    messages!: Message[];

    private numberChange = 0;

    ngOnInit(): void {
        this.currentUser = this.firebaseService.getFirebaseAccount();
    }

    ngAfterViewInit(): void {
        this.messageControl.valueChanges.subscribe((value: any) => {
            if (!value || value == '') {
                this.action = 'many';
            } else {
                this.action = 'text';
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.chatsService.getChatMessages(this.friend.chatId).subscribe(messages => {
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
            let updateReaded = true;
            let users!: any;
            this.chatsService.getChat(selectedChatId).pipe(first()).subscribe((chats: any) => {
                users = chats.users.map((u: any) => {
                    if (u.uid === this.currentUser?.uid) {
                        updateReaded = true;
                        u.readed = true;
                    }

                    return u;
                }) as ProfileUser[];

                console.log("clickAsReaded", updateReaded, users);

                if (updateReaded) {
                    from(this.chatsService.readedChatMessage(selectedChatId, users))
                }
            });
        }
    }

    sendMessage(friend: any) {
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

            this.scrollSmoothToBottom();
        }
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

                if (u.uid === this.currentUser?.uid) {
                    updateReaded = true;
                    u.readed = true;
                }

                return u;
            }) as ProfileUser[];

            console.log(updateReaded, users);

            if (updateReaded) {
                from(this.chatsService.readedChatMessage(chatId, users))
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

    clickMoreActions(friend: any) {
        this.moreAction = !this.moreAction;
    }


    readURL(files: any) {
        if (files && files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                return e.target?.result;
            };

            //reader.readAsDataURL(files[0]);
        }
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

        let fileName = files.item(0).name;

        const dialogRef = this.dialog.open(SendPopupComponent, {
            data: { type: 'files', files: files },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            console.log(result);

            if (result) {
                let urls = result.data?.urls;
                let message = '';

                if (urls.length > 0) {
                    for (let i = 0; i < urls.length; ++i) {
                        message = `<a class="hover-pointer no-underline chat-box" target="_blank" href="${urls[i]}"><span><i class="attach-file"></i>${fileName}</span></a>`;
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
            data: { type: 'files', files: files },
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

    openSetAlarm(friend: any) {

    }

    openCreateOrder(friend: any) {

    }

    openOrder(friend: any) {

    }
}
