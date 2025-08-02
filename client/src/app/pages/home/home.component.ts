import { Component, OnInit } from '@angular/core';
import { HomeServices } from '../../core/services-old/home.service';
import { HomeDataModel } from '../../models/response-models/home-data';
import { AuthService } from '@abp/ng.core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    homeDataOfProject = {} as HomeDataModel;
    bgImage = [
        {
            img: 'assets/img/gray-bg.jpg'
        }
    ];

    constructor(private _homeServices: HomeServices,
                private authService: AuthService) {
    }

    ngOnInit() {
        // this.loadDataOfELearning();
        return;
    }

    loadDataOfELearning() {
        this._homeServices.getHomeData().subscribe((res) => {
            if (res.retCode === 0 && res.systemMessage === '') {
                this.homeDataOfProject = res.data;
            }
        });
    }

    register(): void {
        this.authService.navigateToLogin();
    }
}
