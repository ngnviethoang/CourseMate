import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ELearningSchoolComponent } from './pages/elearning-school/e-learning-school.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { AboutComponent } from './pages/about/about.component';
import { TeacherComponent } from './pages/teacher/teacher.component';
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
import { CourseListComponent } from './pages/course-list/course-list.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProductsDetailsComponent } from './pages/products-details/products-details.component';
import { CoursesNewsComponent } from './pages/courses-news/courses-news.component';
import { BlogDetailsStyleTwoComponent } from './pages/courses-details-news/courses-details-news.component';
import { CoursesContentDetailComponent } from './pages/courses-content-detail/courses-content-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterPagesComponent } from './pages/register-pages/register-pages.component';
import { AccountProfileCoursesComponent } from './pages/account-profile-courses/account-profile-courses.component';
import { AccountProfileDetailsComponent } from './pages/account-profile-details/account-profile-details.component';
import { TrainingCourseComponent } from './pages/training-course-list/training-course-list.component';
import { TrainingCourseDetailComponent } from './pages/training-course-detail/training-course-detail.component';
import { ProfileTeacherComponent } from './pages/profile-teacher/profile-teacher.component';
import { RegisterErrorComponent } from './pages/register-error/register-error.component';
import { SendEmailAfterRegisterComponent } from './pages/send-email-after-register/send-email-after-register.component';
import { NotificationUsersComponent } from './pages/notification-users/notification-users.component';
import { AccountBookmarkCourseComponent } from './pages/account-bookmark-course/account-bookmark-course.component';
import { PaymentErrorComponent } from './pages/payment-error/payment-error.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { RunCodeComponent } from './components/run-code/run-code.component';
import { VideoLessonComponent } from './components/video-lesson/video-lesson.component';
import { ProfileComponent } from './pages/profile/profile.component';


const routes: Routes = [
    { path: '', component: ELearningSchoolComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'training-online', component: TrainingCourseComponent },
    { path: 'training-online/:id', component: TrainingCourseDetailComponent },
    { path: 'about', component: AboutComponent },
    { path: 'teacher', component: TeacherComponent },
    { path: 'information-teacher', component: ProfileTeacherComponent },
    { path: 'faq', component: FaqComponent },
    { path: 'coming-soon', component: ComingSoonComponent },
    { path: 'purchase-guide', component: PurchaseGuideComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'terms-of-service', component: TermsOfServiceComponent },
    { path: 'courses/:id', component: CoursesListComponent },
    { path: 'detail-courses/:id', component: CoursesDetailsComponent },
    { path: 'membership-levels', component: MembershipLevelsComponent },
    { path: 'become-teacher', component: BecomeATeacherComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: 'download-document', component: DownLoadRecoursesComponent },
    { path: 'courses', component: CourseListComponent },
    { path: 'cart', component: CartComponent },
    { path: 'payment/:purchaseCode', component: CheckoutComponent },
    { path: 'details-products', component: ProductsDetailsComponent },
    { path: 'gallery', component: GalleryComponent },
    { path: 'news', component: CoursesNewsComponent },
    { path: 'detail-news', component: BlogDetailsStyleTwoComponent },
    { path: 'contact', component: ContactUsComponent },
    { path: 'detail-content-course/:id', component: CoursesContentDetailComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterPagesComponent },
    { path: 'my-course', component: AccountProfileCoursesComponent },
    { path: 'my-information', component: AccountProfileDetailsComponent },
    { path: 'training-online', component: TrainingCourseComponent },
    { path: 'training-online/:id', component: TrainingCourseDetailComponent },
    { path: 'run-code/:id', component: RunCodeComponent },
    { path: 'video-lesson/:id', component: VideoLessonComponent },


    // Here add new pages component
    { path: 'register-error', component: RegisterErrorComponent },
    { path: 'send-email-register-success', component: SendEmailAfterRegisterComponent },
    { path: 'notification', component: NotificationUsersComponent },
    { path: 'bookmark-course', component: AccountBookmarkCourseComponent },
    { path: 'payment-success', component: PaymentSuccessComponent },
    { path: 'payment-error', component: PaymentErrorComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
