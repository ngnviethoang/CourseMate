import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService, ConfigStateService } from '@abp/ng.core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, LogLevel } from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { NotificationService } from '@proxy/services/notifications';
import { NotificationDto } from '@proxy/services/dtos/notifications';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    isSticky = false;
    totalCartItem: string;
    classApplied = false;
    currentUser = this.config.getOne('currentUser');
    notifications: NotificationDto[] = [];
    totalNotification = 0;
    private hubNotificationConnection: HubConnection;
    searchKeyword: string;

    constructor(
        private authService: AuthService,
        private config: ConfigStateService,
        private notificationService: NotificationService,
        private router: Router
    ) {
    }

    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        this.isSticky = scrollPosition >= 50;
    }

    ngOnInit() {
        this.notificationService
            .getList({
                maxResultCount: 10
            })
            .subscribe((response) => {
                this.notifications = response.items;
                this.totalNotification = response.totalCount;
            });

        this.connectHub();
    }

    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    logoutAccount() {
        this.authService.logout();
    }

    get hasLoggedIn() {
        return this.authService.isAuthenticated;
    }

    login() {
        this.authService.navigateToLogin();
        return;
    }

    async submitSearch() {
        await this.router.navigate(['/training-online'], {
            queryParams: { q: this.searchKeyword }
        });
    }

    private receivedNotification(notificationDto: NotificationDto) {
        this.notifications.unshift(notificationDto);
        this.totalNotification += 1;
    }

    private connectHub() {
        this.hubNotificationConnection = new signalR.HubConnectionBuilder()
            .withUrl(environment.hubs.notification)
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();
        this.hubNotificationConnection.on('ReceivedNotification', (notificationDto: NotificationDto) => {
            this.receivedNotification(notificationDto);
        });
        this.hubNotificationConnection.start()
            .then(() => console.log('SignalR connected'))
            .catch(err => console.error('SignalR error:', err));
    }
}
