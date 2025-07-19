import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingIndicatorService {
    private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

    turnOn() {
        this.loadingSubject.next(true);
    }

    turnOff() {
        this.loadingSubject.next(false);
    }
}
