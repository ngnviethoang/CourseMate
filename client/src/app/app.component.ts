import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { LoadingIndicatorService } from './services/loading-indicator.service';
import { LessonComponent } from '@pages';

@Component({
    selector: 'app-root',
    styleUrls: ['./app.component.scss'],
    template: `
        @if (loading$ | async) {
            <div id="loading-overlay" class="overlay">
                <span class="loader"></span>
            </div>
        }
        <router-outlet></router-outlet>
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
    loading$: Observable<boolean>;

    constructor(
        private loadingService: LoadingIndicatorService,
        private router: Router) {
        this.loading$ = this.loadingService.loading$;
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
