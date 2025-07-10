import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-apply-instructor',
    templateUrl: './apply-instructor.component.html',
    styleUrls: ['./apply-instructor.component.scss']
})
export class ApplyInstructorComponent implements OnInit {

    // Tabs
    currentTab = 'tab1';

    constructor() {
    }

    ngOnInit(): void {
    }

    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }

}
