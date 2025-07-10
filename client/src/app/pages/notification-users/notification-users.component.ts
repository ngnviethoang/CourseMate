import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-notification-users',
    templateUrl: './notification-users.component.html',
    styleUrls: ['./notification-users.component.scss']
})
export class NotificationUsersComponent implements OnInit {

    // Tabs
    currentTab = 'tab1';

    constructor() {
    }

    ngOnInit() {
    }

    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }
}
