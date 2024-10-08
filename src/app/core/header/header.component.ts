import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../authentication/auth.service';
import { AlertService } from '../../services/alert.service';
import { ConfigService } from 'src/app/shared/config.service';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChatsService } from 'src/app/services/chats.service';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, AfterViewInit {
    name!: string;
    defaultLang = 'vn';
    isAuthenticated!: boolean;
    isAdmin!: boolean;
    subscription!: Subscription;
    userId!: string;
    staffId!: number | null;
    profilePhotoUrl = '';
    showChat = true;
    chatUnreadCount: number = 0;
    notifications!: any;
    isChatAdmin = false;
    myChat!: any;
    hasPermission = false;

    @Input() notificationUnreadCount: number = 0;
    @Output() public sidenavToggle = new EventEmitter();
    @Output() public sidenavChatToggle = new EventEmitter();
    @Output() public sidenavNotificationToggle = new EventEmitter();

    constructor(
        private alertService: AlertService,
        private router: Router,
        private configService: ConfigService,
        private authService: AuthService,
        private chatService: ChatsService,
        private notificationService: NotificationService,
        private translateService: TranslateService) {
        translateService.setDefaultLang(this.defaultLang);

        let defaultLang = 'vn';
        translateService.use(defaultLang);

        //let browserLang = translateService.getBrowserLang();
        // if (browserLang) {
        //     translateService.use(browserLang);
        // }

        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                if (event.url === '/chats/web') {
                    this.showChat = false;
                } else {
                    this.showChat = true;
                }
            }
        });
    }

    ngAfterViewInit(): void {
        this.profilePhotoUrl = this.configService.getDefaultUserPhoto();
    }

    ngOnInit() {
        this.isAuthenticated = this.authService.isAuthenticated;

        if (this.isAuthenticated) {
            this.name = this.authService.username;
        }

        this.chatService.getCurrentUserChats().subscribe((res: any) => {
            this.myChat = res;
            this.chatUnreadCount = this.myChat.unreadCount;
        });

        if (environment.firebase.adminUsers.find((u: any) => { return u.displayName === this.name })) {
            this.isChatAdmin = true;
        }

        if (this.authService.permissions) this.hasPermission = true;
    }

    login() {
        //this.authService.login();
        this.router.navigateByUrl('/login')
    }

    ngOnDestroy() {
        // prevent memory leak when component is destroyed
        this.subscription?.unsubscribe();
    }

    signout() {
        this.authService.signout();
    }

    public onToggleSidenav = () => {
        this.sidenavToggle.emit();
    }

    onToggleSideNavChat() {
        this.sidenavChatToggle.emit();
    }

    onToggleSideNavNotification() {
        this.sidenavNotificationToggle.emit();
    }

    gotoProfile() {
        let url = `/account/${this.name}`;
        this.router.navigateByUrl(url)
    }

    changePassword() {
        this.router.navigateByUrl('/authentication/change-password');
    }

    changeLanguage(language: string): void {
        this.translateService.use(language);
    }
}