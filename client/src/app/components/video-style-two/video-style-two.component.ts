import { Component, OnInit } from '@angular/core';
import lgVideo from 'lightgallery/plugins/video';
import { BeforeSlideDetail } from 'lightgallery/lg-events';

@Component({
    selector: 'app-video-style-two',
    templateUrl: './video-style-two.component.html',
    styleUrls: ['./video-style-two.component.scss']
})
export class VideoStyleTwoComponent implements OnInit {

    settings = {
        counter: false,
        plugins: [lgVideo]
    };

    constructor() {
    }

    ngOnInit(): void {
    }

    onBeforeSlide = (detail: BeforeSlideDetail): void => {
        const { index, prevIndex } = detail;
        console.log(index, prevIndex);
    };

}
