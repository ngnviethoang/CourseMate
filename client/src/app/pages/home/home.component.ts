import { Component, OnInit } from '@angular/core';
import { HomeServices } from '../../core/services-old/home.service';
import { HomeDataModel } from '../../models/response-models/home-data';

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

  constructor(private _homeServices: HomeServices) {
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
}
