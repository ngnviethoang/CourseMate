import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-instructor',
    templateUrl: './instructor.component.html',
    styleUrls: ['./instructor.component.scss']
})
export class InstructorComponent implements OnInit {

    advisorSlides: OwlOptions = {
        loop: true,
        nav: false,
        dots: true,
        margin: 30,
        autoplay: true,
        autoplayHoverPause: true,
        navText: [
            '<i class=\'bx bx-chevron-left\'></i>',
            '<i class=\'bx bx-chevron-right\'></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 2
            },
            768: {
                items: 2
            },
            992: {
                items: 2
            }
        }
    };

    constructor() {
    }

    ngOnInit(): void {
    }

}
