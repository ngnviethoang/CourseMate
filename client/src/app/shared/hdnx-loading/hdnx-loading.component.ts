import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Component({
    selector: 'app-hdnx-loading',
    templateUrl: './hdnx-loading.component.html',
    standalone: true,
    styleUrls: ['./hdnx-loading.component.scss']
})
export class HdnxLoadingComponent {
    @Input() show: boolean = true;
}
