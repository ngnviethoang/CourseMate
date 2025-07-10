import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-user-comment-courses',
    templateUrl: './user-comment-courses.component.html',
    styleUrls: ['./user-comment-courses.component.scss']
})
export class UserCommentCoursesComponent implements OnInit {

    activeModal = inject(NgbActiveModal);

    @Input() name: string;

    constructor() {

    }

    ngOnInit() {
    }

}
