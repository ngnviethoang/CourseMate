import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberFormatThousand'
})
export class NumberFormatPipe implements PipeTransform {
    transform(value: string): string {
        if (value === null) {
            return '';
        }
        value = value.toString();
        value = value.replace(/\D/g, '');
        const formattedValue = this.formatNumber(value);

        return formattedValue;
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
