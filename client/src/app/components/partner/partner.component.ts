import { Component, Input, OnInit } from '@angular/core';
import { Partner } from '../../models/partner';

@Component({
    selector: 'app-partner',
    templateUrl: './partner.component.html',
    styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit {

    @Input() listPartner?: Partner[];

    constructor() {
    }

    ngOnInit(): void {
    }

}
