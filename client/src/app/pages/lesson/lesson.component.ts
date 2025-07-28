import { Component, OnInit } from '@angular/core';
import { LessonService } from '@proxy/services/lessons';
import { ActivatedRoute, Router } from '@angular/router';
import { MessengerServices } from '../../core/services-old/messenger.service';
import { AuthService } from '@abp/ng.core';
import { LessonDto } from '@proxy/services/dtos/lessons';
import { CourseProgressDto } from '@proxy/services/dtos/user-progresses';
import { UserProgressService } from '@proxy/services/user-progresses';
import { LessonType } from '@proxy/entities/lessons';
import { LoadingIndicatorService } from '../../services/loading-indicator.service';

@Component({
    selector: 'app-lesson',
    templateUrl: './lesson.component.html',
    styleUrls: ['./lesson.component.scss']
})
export class LessonComponent implements OnInit {
    readonly LessonType = LessonType;
    items: { label: string, icon: string, routerLink: string }[] = [];
    courseProgressDto: CourseProgressDto = {} as CourseProgressDto;
    visible: boolean = false;
    lessonDto: LessonDto = {} as LessonDto;
    languages = [
        { name: 'JavaScript', value: 'javascript' },
        { name: 'TypeScript', value: 'typescript' },
        { name: 'Python', value: 'python' },
        { name: 'C++', value: 'cpp' },
        { name: 'Java', value: 'java' }
    ];
    selectedLanguage = this.languages[0];
    editorOptions = {
        theme: 'vs-dark',
        language: this.selectedLanguage.value,
        automaticLayout: true,
        minimap: { enabled: false }
    };
    code: string = `function reverseString(str) {\n  return str.split('').reverse().join('');\n}`;
    testCaseInput: string = `"hello"`;
    output: string = '';
    submissions = [
        { status: 'Accepted', runtime: '32ms', time: new Date() },
        { status: 'Wrong Answer', runtime: '28ms', time: new Date() },
        { status: 'Accepted', runtime: '32ms', time: new Date() },
        { status: 'Wrong Answer', runtime: '28ms', time: new Date() },
        { status: 'Accepted', runtime: '32ms', time: new Date() },
        { status: 'Wrong Answer', runtime: '28ms', time: new Date() }
    ];
    discussions = [
        { severity: 'info', summary: 'Tip', detail: 'You can use split("").reverse().join("") to reverse string.' }
    ];

    currentLessonId: string = '';

    constructor(private lessonService: LessonService,
                private route: ActivatedRoute,
                private loadingService: LoadingIndicatorService,
                private userProgressService: UserProgressService) {
    }

    ngOnInit(): void {
        const courseId = this.route.snapshot.paramMap.get('courseId');

        if (!courseId) return;

        this.items = [
            { label: '', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Course', icon: '', routerLink: '/training-online' }
        ];

        this.loadingService.turnOn();
        this.userProgressService
            .get(courseId)
            .subscribe(response => {
                this.courseProgressDto = response;
                this.items.push({
                    label: response.title,
                    icon: '',
                    routerLink: `/training-online/${response.courseId}`
                });
                this.currentLessonId = response.chapters[0].lessons[0].lessonId;
                this.lessonService
                    .get(this.currentLessonId)
                    .subscribe(lessonDto => {
                        this.lessonDto = lessonDto;
                        this.loadingService.turnOff();
                    });
            });
    }

    runCode() {
        try {
            const input = eval(this.testCaseInput);
            const result = eval(this.code + `   reverseString(${JSON.stringify(input)})`);
            this.output = result;
        } catch (err) {
            this.output = '❌ Error: ' + err;
        }
    }

    onLanguageChange() {
        this.editorOptions = {
            ...this.editorOptions,
            language: this.selectedLanguage.value
        };
    }

    resetCode() {
        this.code = '';
        this.output = '';
    }

    onChangeLesson(lessonId: string) {
        this.loadingService.turnOn();
        this.lessonService.get(lessonId).subscribe(response => {
            this.lessonDto = response;
            this.currentLessonId = response.id;
            this.loadingService.turnOff();
            // fake api
            this.lessonDto.type = LessonType.Video;
        });
    }
}
