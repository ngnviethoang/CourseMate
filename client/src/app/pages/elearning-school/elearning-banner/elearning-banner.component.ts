import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-elearning-banner',
    templateUrl: './elearning-banner.component.html',
    styleUrls: ['./elearning-banner.component.scss']
})
export class ElearningBannerComponent implements OnInit {

    bgImage = [
        {
            img: 'assets/img/gray-bg.jpg'
        }
    ];

    constructor() {
    }

    ngOnInit(): void {
    }

}
