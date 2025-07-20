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
    TrainingOnlineComponent,
    TrainingCourseDetailComponent,
    LessonComponent
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
import { Select } from 'primeng/select';
import { Paginator } from 'primeng/paginator';
import { Image } from 'primeng/image';
import { SplitterModule } from 'primeng/splitter';
import { TabsModule } from 'primeng/tabs';
import { InputIcon } from 'primeng/inputicon';
import { Divider } from 'primeng/divider';

import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor-v2';
import { Card } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { Message } from 'primeng/message';

const CourseMatePreset = definePreset(Lara, {
    semantic: {
        primary: {
            50: '{rose.50}',
            100: '{rose.100}',
            200: '{rose.200}',
            300: '{rose.300}',
            400: '{rose.400}',
            500: '{rose.500}',
            600: '{rose.600}',
            700: '{rose.700}',
            800: '{rose.800}',
            900: '{rose.900}',
            950: '{rose.950}'
        }
    }
});

const monacoConfig: NgxMonacoEditorConfig = {
    baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs',
    defaultOptions: { scrollBeyondLastLine: false },
    onMonacoLoad: () => {
        console.log((<any>window).monaco);
    },
    requireConfig: { preferScriptTags: true },
    monacoRequire: (<any>window).monacoRequire
};

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
        TrainingOnlineComponent,
        TrainingCourseDetailComponent,
        ProfileTeacherComponent,
        UserCommentCoursesComponent,
        UserReviewCoursesComponent,
        RegisterErrorComponent,
        SendEmailAfterRegisterComponent,
        NotificationUsersComponent,
        AccountBookmarkCourseComponent,
        CartComponent,
        LessonComponent
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
        Popover,
        Select,
        Paginator,
        Image,
        SplitterModule,
        TabsModule,
        InputIcon,
        Divider,
        MonacoEditorModule.forRoot(monacoConfig),
        Card,
        MessagesModule,
        TableModule,
        Message
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


