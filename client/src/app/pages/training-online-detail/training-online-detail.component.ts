import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import lgVideo from 'lightgallery/plugins/video';
import { BeforeSlideDetail } from 'lightgallery/lg-events';
import { AuthService, Rest } from '@abp/ng.core';
import Params = Rest.Params;
import { CourseService } from '@proxy/services/courses';
import { CourseDto } from '@proxy/services/dtos/courses';
import { CartService } from '@proxy/services/carts';
import { MessageService } from '@services';

@Component({
    selector: 'app-training-training-online-detail',
    templateUrl: './training-online-detail.component.html',
    styleUrls: ['./training-online-detail.component.scss'],
    standalone: false
})
export class TrainingOnlineDetailComponent implements OnInit {
    settings = {
        counter: false,
        plugins: [lgVideo]
    };

    currentTab = 'tab1';
    courseDto: CourseDto = {} as CourseDto;
    isInCart = false;

    constructor(private courseService: CourseService,
                private route: ActivatedRoute,
                private messageService: MessageService,
                private authService: AuthService,
                private cartService: CartService,
                private router: Router) {
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.courseService.get(id).subscribe((courseDto) => {
            this.courseDto = courseDto;
            this.isInCart = courseDto.isInCart;
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

    async onAddToCart(courseId: string) {
        if (!this.authService.isAuthenticated) {
            let queryParams: Params = { returnUrl: this.router.url };
            this.authService.navigateToLogin(queryParams);
        }

        if (this.courseDto.isEnrollment) {
            await this.router.navigate(['/course', this.courseDto.id]);
            return;
        }

        if (this.isInCart) {
            await this.router.navigate(['/cart']);
            return;
        }

        this.cartService.create({ courseId: courseId }).subscribe(_ => {
            this.messageService.success('Thông báo', 'Thêm vào giỏ hàng thành công');
            this.isInCart = true;
        });
    }
}
