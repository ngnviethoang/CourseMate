import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';

@Component({
    selector: 'app-funfacts-feedback',
    templateUrl: './funfacts-feedback.component.html',
    styleUrls: ['./funfacts-feedback.component.scss']
})
export class FunfactsFeedbackComponent implements OnInit {

    bgImage = [
        {
            img: 'assets/img/white-bg.jpg'
        }
    ];
    feedbackSlides: OwlOptions = {
        loop: true,
        nav: false,
        dots: true,
        autoplayHoverPause: true,
        autoplay: true,
        animateOut: 'fadeOut',
        autoHeight: true,
        items: 1,
        navText: [
            '<i class=\'bx bx-chevron-left\'></i>',
            '<i class=\'bx bx-chevron-right\'></i>'
        ]
    };
    oaFeedbackSlides: OwlOptions = {
        loop: true,
        nav: true,
        dots: false,
        autoplayHoverPause: true,
        autoplay: true,
        animateOut: 'fadeOut',
        items: 1,
        navText: [
            '<i class=\'bx bx-chevron-left\'></i>',
            '<i class=\'bx bx-chevron-right\'></i>'
        ]
    };

    constructor(
        public router: Router
    ) {
    }

    ngOnInit(): void {
    }

}
