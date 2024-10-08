import { Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, Self, ViewChild } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import {
    combineLatest,
    from,
    map,
    Observable,
    startWith,
} from 'rxjs';
import { ChatsService } from 'src/app/services/chats.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Message } from 'src/app/shared/models/chat/chat';
import { ProfileUser } from 'src/app/shared/models/chat/user-profile';

@Component({
    selector: 'app-chat-list',
    templateUrl: './chat-list.component.html',
    styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
    @ViewChild('endOfChat') endOfChat!: ElementRef;
    @Input() inbox = false;
    @Output() outUnreadCount: any = new EventEmitter;
    friend: any = {};
    user$ = this.firebaseService.getCurrentUserProfile();
    myChat!: any;
    currentUser!: any;

    searchControl = new FormControl<any>('', { nonNullable: true });
    messageControl = new FormControl<any>('', { nonNullable: true });
    // chatListControl = new FormControl<any>([], { nonNullable: true });

    messages$: Observable<Message[]> | undefined;

    constructor(
        @Optional() @Self() public ngControl: NgControl,
        private firebaseService: FirebaseService,
        private chatsService: ChatsService,
    ) {
    }

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
        });
    }

    async createChat(user: ProfileUser) {
        let chatId = await this.chatsService.isExistingChat([user.uid]);

        if (!chatId) {
            console.log("create new chat with user", user);

            return await this.chatsService.createChat(user);

        } else {
            this.inbox = true;
            this.friend.name = user.displayName || '';
            this.friend.id = user.uid;
            this.friend.chatId = chatId;
            this.friend.chatName = this.chatsService.getChatName(user, [this.currentUser]);

            console.log("open exist chat with user", this.friend);

            return chatId;
        }
    }

    openChat(chat: any) {
        this.inbox = true;
        this.friend.name = chat.chatName || '';
        this.friend.chatId = chat.id;
        this.friend.chatName = chat.chatName;

        from(this.readedChat(chat, this.currentUser));
    }

    async readedChat(chat: any, currentUser: any) {

        let updateReaded = false;
        let users = chat.users.map((u: any) => {
            if (u.uid != this.currentUser.uid) {
                updateReaded = true;
                u.readed = false;
            }

            if (u.uid === currentUser?.uid) {
                updateReaded = true;
                u.readed = true;
            }
            return u;
        }) as ProfileUser[];

        console.log("readedChat", updateReaded);

        if (updateReaded) {
            await this.chatsService.readedChatMessage(chat.id, users);
        }
    }

    closeInbox(event: any) {
        console.log("closeInbox", event);
        this.inbox = false;
    }

    openInbox(event: any) {
        console.log("openInbox", event);
        this.inbox = true;

        // update readed the chat
    }
}
