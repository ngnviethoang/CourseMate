import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService, ConfigStateService } from '@abp/ng.core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, LogLevel } from '@microsoft/signalr';
import { NotificationDto, NotificationService } from '@proxy/user-managements/notifications';
import { environment } from '../../../environments/environment';
import { NotificationType } from '@proxy/shared';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    notificationTypeMap: Record<NotificationType, { icon: string; color: string; title: string }> = {
        [NotificationType.Information]: {
            icon: 'bx bx-info-circle',
            color: 'text-info',
            title: 'Thông tin'
        },
        [NotificationType.Warning]: {
            icon: 'bx bx-error',
            color: 'text-warning',
            title: 'Cảnh báo'
        },
        [NotificationType.Danger]: {
            icon: 'bx bx-shield-x',
            color: 'text-danger',
            title: 'Nguy hiểm'
        },
        [NotificationType.Update]: {
            icon: 'bx bx-refresh',
            color: 'text-primary',
            title: 'Cập nhật'
        },
        [NotificationType.Alert]: {
            icon: 'bx bx-bell',
            color: 'text-danger',
            title: 'Thông báo khẩn'
        },
        [NotificationType.Reminder]: {
            icon: 'bx bx-alarm',
            color: 'text-success',
            title: 'Nhắc nhở'
        }
    };
    isSticky = false;
    totalCartItem: 0;
    classApplied = false;
    currentUser = this.config.getOne('currentUser');
    notifications$: NotificationDto[] = [];
    totalNotification = 0;
    private hubNotificationConnection: HubConnection;

    constructor(
        private authService: AuthService,
        private config: ConfigStateService,
        private notificationService: NotificationService
    ) {
    }

    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        this.isSticky = scrollPosition >= 50;
    }

    ngOnInit() {
        this.notificationService.getListByInput({
            maxResultCount: 10
        }).subscribe((response) => {
            this.notifications$ = response;
            this.totalNotification = this.notifications$.length;
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
    }

    private receivedNotification(notificationDto: NotificationDto) {
        this.notifications$.unshift(notificationDto);
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
