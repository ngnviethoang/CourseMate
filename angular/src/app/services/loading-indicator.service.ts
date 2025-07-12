import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class LoadingIndicatorService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  turnOn() {
    this.loadingSubject.next(true);
  }

  turnOff() {
    this.loadingSubject.next(false);
  }
}
