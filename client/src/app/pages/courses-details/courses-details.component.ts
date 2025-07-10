import { Component, OnInit } from '@angular/core';
import lgVideo from 'lightgallery/plugins/video';
import { BeforeSlideDetail } from 'lightgallery/lg-events';
import { ActivatedRoute } from '@angular/router';
import { CourseServices } from '../../core/services-old/course.service';
import { GetCourseWithDetailsContent } from '../../models/response-models/course-content-with-detail';
import { LightGallery } from 'lightgallery/lightgallery';
import { CartServices } from '../../core/services-old/cart.service';
import { AuthenticationServices } from '../../core/services-old/authentication.service';

@Component({
    selector: 'app-courses-details',
    templateUrl: './courses-details.component.html',
    styleUrls: ['./courses-details.component.scss']
})
export class CoursesDetailsComponent implements OnInit {

    idCourse: number = 0;
    courseContentCourse: GetCourseWithDetailsContent | null | undefined;
    isLoading = false;
    videoSource = '';
    settings = {
        counter: false,
        plugins: [lgVideo],
        download: false,
        dynamic: true
    };
    // Tabs
    currentTab = 'tab1';
    private lightGallery: LightGallery | undefined;

    constructor(
        private readonly router: ActivatedRoute,
        private readonly courseServices: CourseServices,
        private readonly cartServices: CartServices,
        private readonly authenticationServices: AuthenticationServices
    ) {
    }

    get isMemberAccount() {
        return this.authenticationServices.isCheckMemberAccount();
    }

    ngOnInit(): void {
        this.idCourse = Number(this.router.snapshot.paramMap.get('id'));
        this.loadDataOfContent(this.idCourse);
    }

    onBeforeSlide = (detail: BeforeSlideDetail): void => {
        const { index, prevIndex } = detail;
        console.log(index, prevIndex);
    };

    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }

    onInit = (detail): void => {
        this.lightGallery = detail.instance;
    };

    openGallery = () => {
        this.lightGallery.openGallery();
    };

    loadDataOfContent(id: number) {
        this.isLoading = true;
        this.courseServices.getCourses(id).subscribe((res) => {
            if (res.retCode === 0 && res.systemMessage === '') {
                this.courseContentCourse = res.data;
                this.isLoading = false;
                const itemGalley: any[] = [
                    {
                        sizes: '1280-720',
                        video: {
                            source: [
                                {
                                    src: this.courseContentCourse.fileUploadUrlStream,
                                    type: 'video/mp4'
                                }
                            ],
                            tracks: [],
                            attributes: { preload: 'none', controls: true }
                        }
                    }
                ];
                this.lightGallery.refresh(itemGalley);
            } else {
                this.isLoading = false;
            }
        });
    }

    addCourseToCart() {
        this.cartServices.addCourse(this.courseContentCourse);
    }

}
