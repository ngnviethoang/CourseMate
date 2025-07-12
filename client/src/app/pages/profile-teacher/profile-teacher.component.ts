import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-profile-teacher',
    templateUrl: './profile-teacher.component.html',
    styleUrls: ['./profile-teacher.component.scss']
})
export class ProfileTeacherComponent implements OnInit {

    // Tabs
    currentTab = 'tab1';
    currentTab2 = 'tab-pane1';
    currentTab3 = 'tab-pane-pane1';

    constructor() {
    }

    ngOnInit(): void {
    }

    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }

    switchTab2(event: MouseEvent, tabPane: string) {
        event.preventDefault();
        this.currentTab2 = tabPane;
    }

    switchTab3(event: MouseEvent, tabPane1: string) {
        event.preventDefault();
        this.currentTab3 = tabPane1;
    }

}
