import { Component, OnInit } from '@angular/core';
import { HomeServices } from '../../core/services-old/home.service';
import { HomeDataModel } from '../../models/response-models/home-data';

@Component({
    selector: 'app-e-learning-school',
    templateUrl: './e-learning-school.component.html',
    styleUrls: ['./e-learning-school.component.scss']
})
export class ELearningSchoolComponent implements OnInit {
    homeDataOfProject: HomeDataModel | null | undefined;

    constructor(private _homeServices: HomeServices) {
    }

    ngOnInit() {
        // this.loadDataOfELearning();
    }

    loadDataOfELearning() {
        this._homeServices.getHomeData().subscribe((res) => {
            if (res.retCode === 0 && res.systemMessage === '') {
                this.homeDataOfProject = res.data;
            }
        });
    }
}
