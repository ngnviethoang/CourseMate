import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

    // Accordion
    contentHeight: number = 0;
    openSectionIndex: number = -1;

    constructor() {
    }

    ngOnInit(): void {
    }

    toggleSection(index: number): void {
        if (this.openSectionIndex === index) {
            this.openSectionIndex = -1;
        } else {
            this.openSectionIndex = index;
            this.calculateContentHeight();
        }
    }

    isSectionOpen(index: number): boolean {
        return this.openSectionIndex === index;
    }

    calculateContentHeight(): void {
        const contentElement = document.querySelector('.accordion-content');
        if (contentElement) {
            this.contentHeight = contentElement.scrollHeight;
        }
    }

}
