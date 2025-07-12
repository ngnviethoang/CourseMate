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
import { APP_ROUTE_PROVIDER } from './route.provider';
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
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { PartnerComponent } from './components/partner/partner.component';
import { ELearningSchoolComponent } from './pages/elearning-school/e-learning-school.component';
import { PremiumAccessComponent } from './components/premium-access/premium-access.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { AboutComponent } from './pages/about/about.component';
import { TeacherComponent } from './pages/teacher/teacher.component';
import { PaymentErrorComponent } from './pages/payment-error/payment-error.component';
import { ComingSoonComponent } from './pages/coming-soon/coming-soon.component';
import { PurchaseGuideComponent } from './pages/purchase-guide/purchase-guide.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';
import { FaqComponent } from './pages/faq/faq.component';
import { CoursesListComponent } from './pages/courses-list/courses-list.component';
import { CoursesDetailsComponent } from './pages/courses-details/courses-details.component';
import { MembershipLevelsComponent } from './pages/membership-levels/membership-levels.component';
import { BecomeATeacherComponent } from './pages/become-a-teacher/become-a-teacher.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { DownLoadRecoursesComponent } from './pages/down-load-recourses/down-load-resourses.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProductsDetailsComponent } from './pages/products-details/products-details.component';
import { CoursesNewsComponent } from './pages/courses-news/courses-news.component';
import { BlogDetailsStyleTwoComponent } from './pages/courses-details-news/courses-details-news.component';
import { ElearningBannerComponent } from './pages/elearning-school/elearning-banner/elearning-banner.component';
import { FeaturesComponent } from './components/features/features.component';
import { ElearningAboutComponent } from './pages/elearning-school/elearning-about/elearning-about.component';
import { FunfactsFeedbackComponent } from './components/funfacts-feedback/funfacts-feedback.component';
import { VideoComponent } from './components/video/video.component';
import { CoursesComponent } from './components/courses/courses.component';
import { InstructorComponent } from './components/instructor/instructor.component';
import { TrainingComponent } from './components/training/training.component';
import { ApplyInstructorComponent } from './components/apply-instructor/apply-instructor.component';
import { TeacherRegisterComponent } from './components/teacher-register/teacher-register.component';
import { VideoStyleTwoComponent } from './components/video-style-two/video-style-two.component';
import { CoursesContentDetailComponent } from './pages/courses-content-detail/courses-content-detail.component';
import { RegisterPagesComponent } from './pages/register-pages/register-pages.component';
import { AccountProfileCoursesComponent } from './pages/account-profile-courses/account-profile-courses.component';
import { AccountProfileDetailsComponent } from './pages/account-profile-details/account-profile-details.component';
import { TrainingCourseComponent } from './pages/training-course-list/training-course-list.component';
import { TrainingCourseDetailComponent } from './pages/training-course-detail/training-course-detail.component';
import { ProfileTeacherComponent } from './pages/profile-teacher/profile-teacher.component';
import { UserCommentCoursesComponent } from './components/modals/user-comment-courses/user-comment-courses.component';
import { UserReviewCoursesComponent } from './components/modals/user-review-courses/user-review-courses.component';
import { IndicatorLoadingComponent } from './components/indicator-loading/indicator-loading.component';
import { RegisterErrorComponent } from './pages/register-error/register-error.component';
import { SendEmailAfterRegisterComponent } from './pages/send-email-after-register/send-email-after-register.component';
import { NotificationUsersComponent } from './pages/notification-users/notification-users.component';
import { AccountBookmarkCourseComponent } from './pages/account-bookmark-course/account-bookmark-course.component';
import { NgOptimizedImage } from '@angular/common';
import { PopoverModule } from 'ngx-bootstrap/popover';

//primeng-ui
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { definePreset } from '@primeng/themes';
import { MessageService } from 'primeng/api';
import { ProgressSpinner } from 'primeng/progressspinner';

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
        ELearningSchoolComponent,
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
        CartComponent,
        CheckoutComponent,
        ProductsDetailsComponent,
        CoursesNewsComponent,
        BlogDetailsStyleTwoComponent,
        ElearningBannerComponent,
        FeaturesComponent,
        ElearningAboutComponent,
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
        TrainingCourseComponent,
        TrainingCourseDetailComponent,
        ProfileTeacherComponent,
        UserCommentCoursesComponent,
        UserReviewCoursesComponent,
        IndicatorLoadingComponent,
        RegisterErrorComponent,
        SendEmailAfterRegisterComponent,
        NotificationUsersComponent,
        AccountBookmarkCourseComponent
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
        ProgressSpinner
    ],
    providers: [
        APP_ROUTE_PROVIDER,
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
