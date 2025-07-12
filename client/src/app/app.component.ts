import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { AuthService } from '@abp/ng.core';
import { LoadingIndicatorService } from './services/loading-indicator.service';

@Component({
    selector: 'app-root',
    template: `
        @if (loading$ | async) {
            <div class="fixed h-screen w-screen z-9999 flex justify-center items-center bg-black bg-opacity-50">
                <p-progress-spinner ariaLabel="loading" />
            </div>
        }
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
