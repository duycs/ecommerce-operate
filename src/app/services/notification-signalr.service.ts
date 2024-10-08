import { EventEmitter, Injectable, Output } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { timeout } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class NotificationSignalRService extends BaseService {
    private hubConnection!: signalR.HubConnection
    @Output() onSignalRMessage: EventEmitter<any> = new EventEmitter();
    public message: string = "Notification is disabled";
    public success = false;
    public count = 0;
    public notifications!: any;
    public notificationUnreadCount!: any;
    public bradcastedData!: any[];
    private url = environment.apiUrl;

    constructor(private http: HttpClient,
        private notificationService: NotificationService) {
        super();
    }

    public startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`https://api-dev.sanbanbuon.com/notification/notificationHub`)
            .build();
        this.hubConnection
            .start()
            .then(() => {
                this.message = "Notification connecting...";
                this.success = true;

                this.getNotificationUnreadCount();

                console.log(this.message);
            })
            .catch(err => {
                this.message = "Notification error while starting";
                this.success = false;
                console.log('Error while starting connection: ' + err);
            })
    }

    public addNotificationListener = () => {
        this.hubConnection.on('ReceiveNotification', (data) => {
            console.log("ReceiveNotification", data);

            this.getNotifications(0, 20);
            this.getNotificationUnreadCount();

            this.message = "Receive new notifications";
            this.success = true;

            console.log(this.message);

            setTimeout(() => {
                this.message = "Notification connecting...";
                this.success = true;
            }, environment.loadTimeout);
        });
    }

    public addBroadcastDataListener = () => {
        this.hubConnection.on('ReceiveNotification', (data) => {
            this.bradcastedData = data;

            this.onSignalRMessage.emit();

            this.getNotificationUnreadCount();

            this.message = "Receive new notifications";
            this.success = true;

            setTimeout(() => {
                this.message = "Notification connecting...";
                this.success = true;
            }, environment.loadTimeout);
        })
    }

    getNotifications(page: number, size: number) {
        this.notificationService.getNotifications({}, page, size).subscribe((res: any) => {
            if (res) {
                this.notifications = res.items;
            }
        });
    }

    getNotificationUnreadCount() {
        this.notificationService.getUnreadCount().subscribe((res: any) => {
            this.notificationUnreadCount = res;
        });
    }
}