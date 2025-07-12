import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

    bgImage = [
        {
            img: 'assets/img/register-shape.jpg'
        }
    ];

    constructor() {
    }

    ngOnInit(): void {
    }

    submit(form) {
        var name = form.name;
        console.log(name);

        var email = form.email;
        console.log(email);

        var number = form.number;
        console.log(number);

        var message = form.message;
        console.log(message);
    }

}
