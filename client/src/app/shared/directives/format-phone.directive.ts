import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[formControlName][appFormatPhone]'
})
export class FormatPhoneDirective {
    constructor(private el: ElementRef, private renderer: Renderer2) {
    }


    @HostListener('input', ['$event']) onInput(event: Event): void {
        const inputElement = this.el.nativeElement as HTMLInputElement;
        let value = inputElement.value.replace(/\D/g, ''); // Remove non-numeric characters
        value = this.formatNumber(value);
        // inputElement.value = value;
        this.renderer.setProperty(inputElement, 'value', value);
    }

    private formatNumber(value: string): string {
        // Handle exponential notation
        if (value.includes('e')) {
            const [coefficient, exponent] = value.split('e');
            const formattedCoefficient = this.formatNumber(coefficient);
            return `${formattedCoefficient}e${exponent}`;
        }
        value = value.charAt(0) !== '0' ? '0' + value : value;
        let newStr = '';
        let i = 0;

        for (; i < Math.floor(value.length / 3) - 1; i++) {
            newStr = newStr + value.substr(i * 3, 3) + '-';
        }

        return newStr + value.substr(i * 3);

    }
}
