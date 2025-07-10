import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import lgVideo from 'lightgallery/plugins/video';
import { BeforeSlideDetail } from 'lightgallery/lg-events';
import { CourseDto, CourseService } from '@proxy/catalog-managements/courses';
import { BasketService } from '@proxy/cashiering-managements/baskets';
import { MessengerServices } from '../../core/services-old/messenger.service';
import { AuthService, Rest } from '@abp/ng.core';
import Params = Rest.Params;

@Component({
    selector: 'app-training-course-detail',
    templateUrl: './training-course-detail.component.html',
    styleUrls: ['./training-course-detail.component.scss']
})
export class TrainingCourseDetailComponent implements OnInit {

    settings = {
        counter: false,
        plugins: [lgVideo]
    };

    currentTab = 'tab1';
    courseDto: CourseDto;
    actionText = '';

    constructor(private courseService: CourseService,
                private route: ActivatedRoute,
                private basketService: BasketService,
                private messengerService: MessengerServices,
                private authService: AuthService,
                private router: Router) {
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.courseService.get(id, null).subscribe((courseDto) => {
            this.courseDto = courseDto;
            // this.checkExistInCart();
        });
    }

    onBeforeSlide = (detail: BeforeSlideDetail): void => {
        const { index, prevIndex } = detail;
        console.log(index, prevIndex);
    };

    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }

    async onAddToCart() {
        if (!this.checkExistInCart()) {
            return;
        }

        if (!this.authService.isAuthenticated) {
            let queryParams: Params = { returnUrl: this.router.url };
            this.authService.navigateToLogin(queryParams);
        }

        this.basketService.addItemsByCourseIds([this.courseDto.id]).subscribe(async () => {
            await this.messengerService.success('Thông báo', 'Thêm vào giỏ hàng thành công');
        });
    }

    checkExistInCart() {
        let result = false;
        this.basketService.checkExitsInCartByCourseId(this.courseDto.id).subscribe(response => {
            if (response == true) {
                this.actionText = 'Đã thêm vào giỏ hàng';
            } else {
                this.actionText = 'Thêm vào giỏ hàng';
            }
            result = response;
        });

        return result;
    }
}
