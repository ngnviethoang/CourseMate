import { Component, OnInit } from '@angular/core';
import { LessonService } from '@proxy/services/lessons';
import { ActivatedRoute, Router } from '@angular/router';
import { MessengerServices } from '../../core/services-old/messenger.service';
import { AuthService } from '@abp/ng.core';
import { LessonDto } from '@proxy/services/dtos/lessons';

@Component({
    selector: 'app-lesson',
    templateUrl: './lesson.component.html'
})
export class LessonComponent implements OnInit {
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


    constructor(private lessonService: LessonService,
                private route: ActivatedRoute,
                private messengerService: MessengerServices,
                private authService: AuthService,
                private router: Router) {
    }

    ngOnInit(): void {
        // const id = this.route.snapshot.paramMap.get('id');

        this.lessonService
            .get('02f4c74f-1d34-41b7-afc3-eb9d76175e21')
            .subscribe(response => {
                this.lessonDto = response;
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
        this.code = ''; // or preload default template based on selectedLanguage
        this.output = '';
    }
}
