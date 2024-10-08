import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr"
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class APISignalRService {
    private hubConnection!: signalR.HubConnection
    public message: string = "API signal is disabled";
    public jobs!: any[];
    public bradcastedJobs!: any[];
    private url = environment.apiUrl;

    public startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.url}/apishub`)
            .build();
        this.hubConnection
            .start()
            .then(() => {
                this.message = "API signal connecting...";
                console.log('Connection started');
            })
            .catch(err => {
                this.message = "API signal error while starting";
                console.log('Error while starting connection: ' + err);
            })
    }

    public addGetJobsListener = () => {
        this.hubConnection.on('GetJobs', (data) => {
            this.jobs = data;
            
        });
    }
}