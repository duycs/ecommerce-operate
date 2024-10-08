import { AfterViewInit, Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-notification-list',
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit, AfterViewInit {

    @Input() message!: any;
    @Input() success!: any;
    @Input() notifications!: any[];
    @Input() unseenNotifications: any[] = [];
    @Output() scrollEnd: any = new EventEmitter;
    @Output() scrollUnseenEnd: any = new EventEmitter;

    constructor(
        @Optional() @Self() public ngControl: NgControl,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private notificationService: NotificationService,
        private alertService: AlertService
    ) {
    }

    ngAfterViewInit(): void {
    }

    ngOnInit(): void {

    }

    openPage(item: any) {
        this.notificationService.seen(item.id).subscribe(() => {
            this.getNotifications(0, 20);
            this.getUnseenNotifications(0, 20);
        });

        switch (item.key) {
            case 'delivery_order_created':
                //this.router.navigateByUrl(`/sbb/order-transfers?code=${item.payload?.code}`)
                this.router.navigate(
                    ['/sbb', 'order-transfers'],
                    {
                        queryParams: { code: item.payload?.code },
                        relativeTo: this.activatedRoute,
                    }).then(() => {
                        window.location.reload();
                    });
                break;

            case 'order_created':
                //this.router.navigateByUrl(`/sbb/orders?code=${item.payload?.code}`)
                this.router.navigate(
                    ['/sbb', 'orders'],
                    {
                        queryParams: { code: item.payload?.code },
                        relativeTo: this.activatedRoute,
                    }).then(() => {
                        window.location.reload();
                    });
                break;

            case 'spl_order_confirmed':
                //this.router.navigateByUrl(`/sbb/order-subs?code=${item.payload?.code}`)
                this.router.navigate(
                    ['/sbb', 'order-subs'],
                    {
                        queryParams: { code: item.payload?.code },
                        relativeTo: this.activatedRoute,
                    }).then(() => {
                        window.location.reload();
                    });
                break;
        }
    }

    onNearEndScroll() {
    }

    onScroll(event: any) {
        if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
            this.scrollEnd.emit();
        }
    }

    onUnreadScroll(event: any) {
        if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
            this.scrollUnseenEnd.emit();
        }
    }

    getNotifications(page: number, pageSize: number) {
        this.notificationService.getNotifications({}, page, pageSize).subscribe((res: any) => {
            if (res && res.items.length > 0) {
                this.notifications = this.notifications.concat(res.items);
            } else {
                this.alertService.showToastMessage("Không còn thông báo nào mới");
            }
        });
    }

    getUnseenNotifications(page: number, pageSize: number) {
        this.notificationService.getNotifications({ seen: true }, page, pageSize).subscribe((res: any) => {
            if (res && res.items.length > 0) {
                this.unseenNotifications = this.unseenNotifications.concat(res.items);
            } else {
                this.alertService.showToastMessage("Không còn thông báo chưa đọc nào mới");
            }
        });
    }
}
