import { Component } from '@angular/core';
import { IndicatorLoadingService } from '../../core/ui-services/indicator-loading.service';

@Component({
    selector: 'app-indicator-loading',
    templateUrl: './indicator-loading.component.html',
    styleUrls: ['./indicator-loading.component.scss']
})
export class IndicatorLoadingComponent {
    loading$ = this.loadingService.loading$;

    constructor(private loadingService: IndicatorLoadingService) {
    }
}
