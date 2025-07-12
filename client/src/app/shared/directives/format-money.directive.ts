import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[formControlName][appFormatMoney]'
})
export class FormatMoneyDirective {
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

        const parts = [];
        let len = value.length;

        while (len > 3) {
            parts.unshift(value.slice(len - 3, len));
            len -= 3;
        }

        parts.unshift(value.slice(0, len));

        return parts.join(',');
    }
}
