import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { AuthService } from './core/authentication/auth.service';
import { environment } from 'src/environments/environment';
import { NavigationService } from './services/navigation.service';
import { MatDrawer } from '@angular/material/sidenav';
import { NotificationService } from './services/notification.service';
import { NotificationSignalRService } from './services/notification-signalr.service';
import { Observable, map } from 'rxjs';
import { AlertService } from './services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = "Sbb - Sàn bán buôn";
  showHeader = true;
  isAuthenticated = false;
  isOpenSideMenu = false;
  isOnlyShowPrintLayout = false;
  marginTopHeader = '56px';
  version!: string;
  @ViewChild('drawerChat') drawerChat!: MatDrawer;
  @ViewChild('drawerNotification') drawerNotification!: MatDrawer;
  notifications: any[] = [];
  unseenNotifications: any[] = []
  notificationUnreadCount!: any;
  page = -1;
  pageSize = 20;
  unseenPage = -1;

  constructor(private router: Router,
    private activedRoute: ActivatedRoute,
    private authService: AuthService,
    private notificationService: NotificationService,
    private alertService: AlertService,
    public notificationSignalRService: NotificationSignalRService,
    private navigationService: NavigationService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setValidation();
      }
    });
  }

  ngOnInit(): void {
    this.version = environment.build;
    this.isAuthenticated = this.authService.isAuthenticated;
    this.isOpenSideMenu = this.isAuthenticated;

    if (this.isAuthenticated) {

      console.log("account", this.authService.getAccount());

      console.log("get notification");
      this.notificationSignalRService.startConnection();
      this.notificationSignalRService.addNotificationListener();

      this.getNotifications();
      this.getUnseenNotifications();

      // emit new notification
      this.notificationSignalRService.onSignalRMessage.subscribe((notification: any) => {
        console.log("new notification: ", notification);
        this.getLatestNotification();
      });

    } else {
      console.log("not get notification");
    }
  }

  setValidation() {
    let validation = this.navigationService.displayValidation();
    this.showHeader = validation.showHeader;
    this.isOpenSideMenu = validation.isOpenSideMenu;
    this.isOnlyShowPrintLayout = validation.isOnlyShowPrintLayout;

    if (validation.isChatMobile) {
      this.marginTopHeader = '0';
    }
  }

  toggleChat() {
    this.drawerChat.toggle();

    if (this.drawerNotification.opened) {
      this.drawerNotification.toggle();
    }
  }

  toggleNotification() {
    this.drawerNotification.toggle();

    if (this.drawerChat.opened) {
      this.drawerChat.toggle();
    }
  }

  changeUnreadCount() {

  }

  getLatestNotification() {
    this.notificationService.getNotifications({}, 0, 1).subscribe((res: any) => {
      console.log("last notification", res);

      if (res && res.items && res.items.length > 0) {
        let notification = res?.items[0];

        this.notifications.push(notification);

        if (notification.status == 1) {
          this.unseenNotifications.push(notification);
        }
      }
    });
  }

  getMoreNotifications(event: any) {
    this.getNotifications();
  }

  getMoreUnseenNotifications(event: any) {
    this.getUnseenNotifications();
  }

  getNotifications() {
    this.notificationService.getNotifications({}, ++this.page, this.pageSize).subscribe(res => {
      if (res && res.items.length > 0) {
        this.notifications = this.notifications.concat(res.items);
      } else {
        this.alertService.showToastMessage("Không còn thông báo nào");
      }
    },
      error => {
        this.alertService.showToastMessage("Lỗi tải thông báo");
        --this.page;
      },
      () => { }
    );
  }

  getUnseenNotifications() {
    this.notificationService.getNotifications({ status: 1 }, ++this.unseenPage, this.pageSize).subscribe((res: any) => {
      if (res && res.items.length > 0) {
        this.unseenNotifications = this.unseenNotifications.concat(res.items);
      } else {
        this.alertService.showToastMessage("Không còn thông báo chưa đọc nào");
      }
    },
      error => {
        this.alertService.showToastMessage("Lỗi tải thông báo");
        --this.unseenPage;
      },
      () => { }
    );
  }
}