import { Component, OnInit } from '@angular/core';
import { AuthService } from '@abp/ng.core';
import { LoadingIndicatorService } from './services/loading-indicator.service';
import { Observable } from 'rxjs';
import { SettingTabsService } from '@abp/ng.setting-management/config';
import { StorageSettingsComponent } from './components/storage-settings/storage-settings.component';

@Component({
  standalone: false,
  selector: 'app-root',
  template: `
    @if (loading$ | async) {
      <div class="fixed h-screen w-screen z-9999 flex justify-center items-center bg-black bg-opacity-50">
        <p-progress-spinner ariaLabel="loading" />
      </div>
    }
    @if (isAuthenticated) {
      <abp-loader-bar></abp-loader-bar>
      <abp-dynamic-layout></abp-dynamic-layout>
    }
  `
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  loading$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingIndicatorService,
    private settingTabs: SettingTabsService) {

    this.loading$ = this.loadingService.loading$;
    this.settingTabs.add([
      {
        name: 'Storage',
        component: StorageSettingsComponent,
        requiredPolicy: 'SettingManagement.Storages'
      }
    ]);
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated;

    if (!this.isAuthenticated) {
      this.authService.navigateToLogin();
    }
  }
}
