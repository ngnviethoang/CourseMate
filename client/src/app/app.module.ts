import { CoreModule, provideAbpCore, withOptions } from '@abp/ng.core';
import { provideAbpOAuth } from '@abp/ng.oauth';
import { provideAbpThemeShared, ThemeSharedModule } from '@abp/ng.theme.shared';
import { provideIdentityConfig } from '@abp/ng.identity/config';
import { registerLocale } from '@abp/ng.core/locale';
import { provideThemeBasicConfig, ThemeBasicModule } from '@abp/ng.theme.basic';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CountUpModule } from 'ngx-countup';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { LightboxModule } from 'ngx-lightbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LightgalleryModule } from 'lightgallery/angular';
import { NgbAccordionModule, NgbModalModule, NgbPopover, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxStarsModule } from 'ngx-stars';
import { TransferHttp } from './core/transfer-http/transfer-http';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { GoogleSigninButtonModule, SocialLoginModule } from '@abacritt/angularx-social-login';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgIconsModule } from '@ng-icons/core';
import { bootstrapBookmark, bootstrapBookmarkCheckFill } from '@ng-icons/bootstrap-icons';
import { MentionModule } from 'angular-mentions';
import { NgOptimizedImage } from '@angular/common';
import { PopoverModule } from 'ngx-bootstrap/popover';

import {
    AboutComponent,
    AccountBookmarkCourseComponent,
    AccountProfileCoursesComponent,
    AccountProfileDetailsComponent,
    BecomeATeacherComponent,
    BlogDetailsStyleTwoComponent,
    CartComponent,
    CategoriesComponent,
    CheckoutComponent,
    ComingSoonComponent,
    ContactUsComponent,
    CoursesContentDetailComponent,
    CoursesDetailsComponent,
    CoursesListComponent,
    CoursesNewsComponent,
    DownLoadRecoursesComponent,
    FaqComponent,
    GalleryComponent,
    HomeComponent,
    MembershipLevelsComponent,
    NotificationUsersComponent,
    PaymentErrorComponent,
    PrivacyPolicyComponent,
    ProductsDetailsComponent,
    ProfileTeacherComponent,
    PurchaseGuideComponent,
    RegisterErrorComponent,
    RegisterPagesComponent,
    SendEmailAfterRegisterComponent,
    TeacherComponent,
    TermsOfServiceComponent,
    CourseComponent,
    TrainingCourseDetailComponent
} from '@pages';
import {
    ApplyInstructorComponent,
    CoursesComponent,
    FeaturesComponent,
    FooterComponent,
    FunfactsFeedbackComponent,
    InstructorComponent,
    NavbarComponent,
    PartnerComponent,
    PremiumAccessComponent,
    SubscribeComponent,
    TeacherRegisterComponent,
    TrainingComponent,
    UserCommentCoursesComponent, UserReviewCoursesComponent,
    VideoComponent,
    VideoStyleTwoComponent
} from '@components';

//primeng-ui
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { definePreset } from '@primeng/themes';
import { MessageService } from 'primeng/api';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Button } from 'primeng/button';
import { Popover } from 'primeng/popover';

const CourseMatePreset = definePreset(Lara, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}'
        }
    }
});

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        FooterComponent,
        HomeComponent,
        PartnerComponent,
        PremiumAccessComponent,
        SubscribeComponent,
        ContactUsComponent,
        GalleryComponent,
        AboutComponent,
        TeacherComponent,
        PaymentErrorComponent,
        ComingSoonComponent,
        PurchaseGuideComponent,
        PrivacyPolicyComponent,
        TermsOfServiceComponent,
        FaqComponent,
        CoursesListComponent,
        CoursesDetailsComponent,
        MembershipLevelsComponent,
        BecomeATeacherComponent,
        CategoriesComponent,
        DownLoadRecoursesComponent,
        CoursesComponent,
        CheckoutComponent,
        ProductsDetailsComponent,
        CoursesNewsComponent,
        BlogDetailsStyleTwoComponent,
        FeaturesComponent,
        FunfactsFeedbackComponent,
        VideoComponent,
        CoursesComponent,
        InstructorComponent,
        TrainingComponent,
        ApplyInstructorComponent,
        TeacherRegisterComponent,
        VideoStyleTwoComponent,
        CoursesContentDetailComponent,
        // LoginComponent,
        RegisterPagesComponent,
        AccountProfileCoursesComponent,
        AccountProfileDetailsComponent,
        CourseComponent,
        TrainingCourseDetailComponent,
        ProfileTeacherComponent,
        UserCommentCoursesComponent,
        UserReviewCoursesComponent,
        RegisterErrorComponent,
        SendEmailAfterRegisterComponent,
        NotificationUsersComponent,
        AccountBookmarkCourseComponent,
        CartComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ThemeSharedModule,
        CoreModule,
        ThemeBasicModule,
        BrowserModule,
        AppRoutingModule,
        CarouselModule,
        BrowserAnimationsModule,
        CountUpModule,
        NgxScrollTopModule,
        LightboxModule,
        FormsModule,
        LightgalleryModule,
        NgbModalModule,
        NgxStarsModule,
        NgbAccordionModule,
        NgbTooltipModule,
        PaginationModule.forRoot(),
        BsDropdownModule.forRoot(),
        ReactiveFormsModule,
        SocialLoginModule,
        GoogleSigninButtonModule,
        NgIconsModule.withIcons({ bootstrapBookmark, bootstrapBookmarkCheckFill }),
        MentionModule,
        NgOptimizedImage,
        PopoverModule,
        NgbPopover,
        ProgressSpinner,
        Button,
        Popover
    ],
    providers: [
        provideAbpCore(
            withOptions({
                environment,
                registerLocaleFn: registerLocale()
            })
        ),
        provideAbpOAuth(),
        provideIdentityConfig(),
        provideAbpThemeShared(),
        provideThemeBasicConfig(),
        [TransferHttp],

        //primeng-ui
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: CourseMatePreset
            }
        }),
        MessageService
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}


