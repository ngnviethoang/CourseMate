import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CourseService } from '@proxy/services/courses';

@Component({
    selector: 'app-video-lesson',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './video-lesson.component.html',
    styleUrls: ['./video-lesson.component.scss']
})
export class VideoLessonComponent implements OnInit {
    course: any;
    currentLessonId: string;
    currentLesson: any | null;

    @ViewChild('videoPlayer') videoPlayerRef!: ElementRef<HTMLVideoElement>;

    constructor(private courseService: CourseService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        const courseId = this.route.snapshot.paramMap.get('id');
        this.currentLessonId = this.route.snapshot.queryParamMap.get('lessonId');
        this.courseService.get(courseId, null).subscribe((courseDto) => {
            this.course = courseDto;
            this.currentLesson = this.findLessonById(this.currentLessonId);
        });
    }

    selectLesson(lesson: any): void {
        this.currentLessonId = lesson.id;
        this.currentLesson = lesson;
        setTimeout(() => {
            if (this.videoPlayerRef && this.videoPlayerRef.nativeElement) {
                this.videoPlayerRef.nativeElement.load();
            }
        });
    }

    findLessonById(lessonId: string): any | null {
        for (const chapter of this.course.chapters) {
            for (const lesson of chapter.lessons) {
                if (lesson.id === lessonId) {
                    return lesson;
                }
            }
        }

        return this.course.chapters?.[0]?.lessons?.[0] ?? null;
    }

    getVideoSrc(fileVideoName: string) {
        return environment.apis.default.url + '/api/files/video' + fileVideoName;
    }
}
