import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
    selector: 'app-root',
    template: `
        <abp-loader-bar></abp-loader-bar>
        <app-indicator-loading />
        <app-navbar *ngIf="!(location === '/coming-soon')"></app-navbar>
        <router-outlet></router-outlet>
        <app-footer *ngIf="!(location === '/coming-soon')"></app-footer>
        <ngx-scrolltop></ngx-scrolltop>
    `,
    providers: [
        Location, {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }
    ]
})

export class AppComponent implements OnInit {
    location: any;
    routerSubscription: any;

    constructor(private router: Router){
    }

    ngOnInit() {
        this.recallJsFunctions();
    }

    recallJsFunctions() {
        this.routerSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
            .subscribe(event => {
                this.location = this.router.url;
                if (!(event instanceof NavigationEnd)) {
                    return;
                }
                window.scrollTo(0, 0);
            });
    }
}
