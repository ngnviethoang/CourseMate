import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class NotificationHubService {

    public notificationItems: Notification[] = [];
    private hubConnection: HubConnection | undefined;

    constructor() {
    }

    public get count(): number {
        return this.notificationItems.length;
    };

    public startConnection() {
        let baseUrl = environment.baseUrlHub;
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(`${baseUrl}hub-notification`).withAutomaticReconnect().configureLogging(LogLevel.Information)
            .build();
        this.hubConnection
            .start()
            .then(() => {
                console.log('Connection started');
            })
            .catch(err => {
                console.log('Error while starting connection: ' + err);
            });
    }

}
