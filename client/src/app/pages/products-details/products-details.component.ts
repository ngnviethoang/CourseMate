import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-products-details',
    templateUrl: './products-details.component.html',
    styleUrls: ['./products-details.component.scss']
})
export class ProductsDetailsComponent implements OnInit {

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
