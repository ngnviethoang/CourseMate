import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-run-code',
    standalone: true,
    imports: [CommonModule, FormsModule, NgFor, NgIf],
    templateUrl: './run-code.component.html',
    styleUrls: ['./run-code.component.css']
})
export class RunCodeComponent implements OnInit, OnDestroy {
    getLineCount(): number {
        return this.userCode.split('\n').length;
    }

    getFileExtension(): string {
        if (this.selectedLanguage === 'python') {
            return 'py';
        } else if (this.selectedLanguage === 'java') {
            return 'java';
        } else if (this.selectedLanguage === 'javascript') {
            return 'js';
        }
        return '';
    }

    // Exercise state
    currentExerciseIndex = 0;
    currentExercise: any | null = null;

    // Exercise metadata
    exerciseTitle: string = '';
    exerciseQuestion: string = '';
    exerciseDifficulty: string = '';

    // Code editor state
    userCode = '';
    selectedLanguage = 'javascript';
    availableLanguages = [
        { value: 'javascript', name: 'JavaScript' },
        { value: 'python', name: 'Python' },
        { value: 'java', name: 'Java' }
    ];
    id: string = '';

    // Test cases
    testCases: { input: string, expected: string, output: string, passed: boolean }[] = [];
    testResults = { passed: 0, total: 0 };

    // Console/output
    consoleOutput = '';
    isExecuting = false;
    executionTime = 0;

    // Timer
    showTimer = true;
    timeRemaining = 120;
    private timerInterval: any;

    // Navigation
    hasPrevious = false;
    hasNext = false;
    isCompleted = false;
    totalExercises = 0;

    constructor(private router: ActivatedRoute, private http: HttpClient) {
    }

    ngOnInit() {
        this.router.paramMap.subscribe(params => {
            this.id = params.get('id') || '';
           /* this.exerciseService.get(this.id).subscribe((exercise: ExerciseDto) => {
                this.currentExercise = exercise;
                if (this.currentExercise) {
                    this.updateExerciseState();
                }
            });*/
        });
        this.startTimer();
    }

    private updateExerciseState() {
    /*    if (this.currentExercise) {
            this.exerciseTitle = this.currentExercise.title || '';
            this.exerciseQuestion = this.currentExercise.question || '';
            this.exerciseDifficulty = this.currentExercise.difficulty ? DifficultyType[this.currentExercise.difficulty] : '';
            this.userCode = this.currentExercise.userCode || '';
            this.testCases = this.currentExercise.testCases.map(tc => ({
                input: tc.input || '',
                expected: tc.expected || '',
                output: tc.output || '',
                passed: tc.passed || false
            }));
            this.totalExercises = 1; // Assuming a single exercise for now.
            this.testResults = {
                passed: this.testCases.filter(tc => tc.passed).length,
                total: this.testCases.length
            };
            this.updateNavigationState();
        }*/
    }

    wrapUserCode(userCode: string, input: string): string {
        if (this.selectedLanguage === 'python') {
            return `
${userCode}

print(${this.getFunctionName()}(${input}))
`.trim();
        } else if (this.selectedLanguage === 'java') {
            return `
public class Main {
    ${userCode}

    public static void main(String[] args) {
        System.out.println(${this.getFunctionName()}(${input}));
    }
}
`.trim();
        }

        // Default JavaScript wrapper
        return `
${userCode}

console.log(${this.getFunctionName()}(${input}));
`.trim();
    }

    private getFunctionName(): string {
        if (this.selectedLanguage === 'python') {
            const match = this.userCode.match(/def\s+([a-zA-Z_][0-9a-zA-Z_]*)/);
            return match ? match[1] : 'solution';
        } else if (this.selectedLanguage === 'java') {
            const match = this.userCode.match(/public\s+static\s+\w+\s+([a-zA-Z_][0-9a-zA-Z_]*)/);
            return match ? match[1] : 'solution';
        }
        const match = this.userCode.match(/function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/);
        return match ? match[1] : 'solution';
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.timeRemaining > 0) {
                this.timeRemaining--;
            } else {
                clearInterval(this.timerInterval);
                this.consoleOutput += '\n⏰ Time expired! Please submit your solution.\n';
            }
        }, 1000);
    }

    async runCode() {
        if (this.isExecuting) return;

        this.isExecuting = true;
        this.consoleOutput = '🚀 Running code...\n';
        const startTime = performance.now();

        try {
            await this.executeTestCasesWithDelay(0);
        } catch (error) {
            console.error('Error executing tests:', error);
        } finally {
            this.executionTime = Math.round(performance.now() - startTime);
            this.isExecuting = false;

            const passedCount = this.testCases.filter(tc => tc.passed).length;
            this.testResults = { passed: passedCount, total: this.testCases.length };

            if (passedCount === this.testCases.length) {
                this.consoleOutput += `\n✅ All tests passed in ${this.executionTime}ms!\n`;
            } else {
                this.consoleOutput += `\n⚠️ ${passedCount}/${this.testCases.length} tests passed\n`;
            }
        }
    }

    private async executeTestCasesWithDelay(index: number): Promise<void> {
        if (index >= this.testCases.length) return;

        const testCase = this.testCases[index];
        const wrappedCode = this.wrapUserCode(this.userCode, testCase.input);

        try {
            const response: any = await this.http.post('https://emkc.org/api/v2/piston/execute', {
                language: this.selectedLanguage,
                version: '*',
                files: [{ name: 'main', content: wrappedCode }]
            }).toPromise();

            let rawOutput = (response?.run?.stdout || '').trim();
            rawOutput = rawOutput.replace(/['"\n]+$/g, '');

            const outputNumber = isNaN(Number(rawOutput)) ? rawOutput : Number(rawOutput);
            const expectedNumber = isNaN(Number(testCase.output)) ? testCase.output : Number(testCase.output);

            testCase.output = rawOutput;
            testCase.passed = outputNumber === expectedNumber;

            if (index === 0) {
                this.consoleOutput = '🚀 Running code...\n';
            }

            if (index < 3) {
                this.consoleOutput += `${testCase.passed ? '✅' : '❌'} Case ${index + 1}: ${testCase.input} → ${rawOutput} (Expected: ${testCase.expected})\n`;
            }

            await new Promise(resolve => setTimeout(resolve, 300));
            await this.executeTestCasesWithDelay(index + 1);

        } catch (error: any) {
            testCase.output = 'Error';
            testCase.passed = false;
            const errorMsg = error.error?.message || error.message || 'Unknown error';

            if (index < 3) {
                this.consoleOutput += `❌ Case ${index + 1} failed: ${errorMsg}\n`;
            }

            await new Promise(resolve => setTimeout(resolve, 300));
            await this.executeTestCasesWithDelay(index + 1);
        }
    }

    submitCode() {
        const passedCount = this.testCases.filter(tc => tc.passed).length;

        if (passedCount === this.testCases.length) {
            this.isCompleted = true;
            this.consoleOutput += '\n🎉 Congratulations! All tests passed!\n';
        } else {
            this.consoleOutput += `\n⚠️ Please pass all test cases before submitting (${passedCount}/${this.testCases.length} passed)\n`;
        }
    }

    clearConsole() {
        this.consoleOutput = '';
    }

    formatCode() {
        try {
            if (this.selectedLanguage === 'javascript') {
                this.userCode = this.userCode
                    .replace(/\bif\b/g, ' if ')
                    .replace(/\belse\b/g, ' else ')
                    .replace(/\bfor\b/g, ' for ')
                    .replace(/\bwhile\b/g, ' while ')
                    .replace(/\bfunction\b/g, 'function ')
                    .replace(/{/g, ' { ')
                    .replace(/}/g, ' } ')
                    .replace(/\s+/g, ' ')
                    .trim();
            }
            this.consoleOutput += '🔧 Code formatted (basic formatting applied)\n';
        } catch (error) {
            this.consoleOutput += '⚠️ Could not format code\n';
        }
    }

    navigate(direction: 'prev' | 'next') {
        if (direction === 'prev' && this.currentExerciseIndex > 0) {
            this.currentExerciseIndex--;
        } else if (direction === 'next' && this.currentExerciseIndex < this.totalExercises - 1) {
            this.currentExerciseIndex++;
        }

        this.loadExercise(this.currentExerciseIndex);
    }

    private loadExercise(index: number) {
        this.currentExercise = null; // Clear the current exercise
        /*this.exerciseService.get('exerciseId').subscribe((exercise: ExerciseDto) => {
            this.currentExercise = exercise;
            this.updateExerciseState();
        });*/
    }

    ngOnDestroy() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    private updateNavigationState() {
        this.hasPrevious = this.currentExerciseIndex > 0;
        this.hasNext = this.currentExerciseIndex < this.totalExercises - 1;
    }
}
