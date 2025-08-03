import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    AboutComponent,
    AccountBookmarkCourseComponent,
    AccountProfileCoursesComponent,
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
    TrainingOnlineDetailComponent,
    AccountSettingComponent,
    CourseListComponent,
    LoginComponent,
    RunCodeComponent,
    VideoLessonComponent,
    PaymentSuccessComponent,
    LessonComponent
} from '@pages';

import { DefaultLayoutComponent, EmptyLayoutComponent } from '@components';

import { authGuard } from '@abp/ng.core';

const routes: Routes = [
    {
        path: '',
        component: DefaultLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'training-online', component: TrainingOnlineComponent },
            { path: 'training-online/:id', component: TrainingOnlineDetailComponent, canActivate: [authGuard] },
            { path: 'cart', component: CartComponent, canActivate: [authGuard] },
            { path: 'checkout/:orderId', component: CheckoutComponent, canActivate: [authGuard] },
            { path: 'account-setting', component: AccountSettingComponent, canActivate: [authGuard] },

            { path: 'about', component: AboutComponent },
            { path: 'teacher', component: TeacherComponent },
            { path: 'information-teacher', component: ProfileTeacherComponent },
            { path: 'faq', component: FaqComponent },
            { path: 'coming-soon', component: ComingSoonComponent },
            { path: 'purchase-guide', component: PurchaseGuideComponent },
            { path: 'privacy-policy', component: PrivacyPolicyComponent },
            { path: 'terms-of-service', component: TermsOfServiceComponent },
            // { path: 'courses/:id', component: CoursesListComponent },
            // { path: 'detail-courses/:id', component: CoursesDetailsComponent },
            { path: 'membership-levels', component: MembershipLevelsComponent },
            { path: 'become-teacher', component: BecomeATeacherComponent },
            { path: 'categories', component: CategoriesComponent },
            { path: 'download-document', component: DownLoadRecoursesComponent },
            // { path: 'courses', component: CourseListComponent },
            { path: 'details-products', component: ProductsDetailsComponent },
            { path: 'gallery', component: GalleryComponent },
            { path: 'news', component: CoursesNewsComponent },
            { path: 'detail-news', component: BlogDetailsStyleTwoComponent },
            { path: 'contact', component: ContactUsComponent },
            { path: 'detail-content-training-online/:id', component: CoursesContentDetailComponent },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterPagesComponent },
            { path: 'my-training-online', component: AccountProfileCoursesComponent },
            { path: 'training-online', component: TrainingOnlineComponent },
            { path: 'training-online/:id', component: TrainingOnlineDetailComponent },
            { path: 'run-code/:id', component: RunCodeComponent },
            { path: 'video-lesson/:id', component: VideoLessonComponent },

            // Here add new pages component
            { path: 'register-error', component: RegisterErrorComponent },
            { path: 'send-email-register-success', component: SendEmailAfterRegisterComponent },
            { path: 'notification', component: NotificationUsersComponent },
            { path: 'bookmark-training-online', component: AccountBookmarkCourseComponent },
            { path: 'payment-success', component: PaymentSuccessComponent },
            { path: 'payment-error', component: PaymentErrorComponent }
        ]
    },
    {
        path: '',
        component: EmptyLayoutComponent,
        children: [{ path: 'course/:courseId', component: LessonComponent }]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
