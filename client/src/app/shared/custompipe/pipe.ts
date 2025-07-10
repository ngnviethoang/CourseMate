import { Pipe, PipeTransform } from '@angular/core';
import { ClientConfig } from '../clientconfig/clientconfig';
import { DatePipe, DecimalPipe } from '@angular/common';
import { String } from '../utilities/string';


@Pipe({
    name: 'dateTimeFormat'
})
export class DateTimeFormat extends DatePipe implements PipeTransform {
    override transform(value: any): any {
        return super.transform(value, ClientConfig.GetResClientConfig('DateTimeFormat'));
    }
}

@Pipe({
    name: 'dateFormat'
})
export class DateFormat extends DatePipe implements PipeTransform {
    override transform(value: any): any {
        return super.transform(value, ClientConfig.GetResClientConfig('DateFormat'));
    }
}

@Pipe({
    name: 'numberFormat'
})
export class NumberFormat extends DecimalPipe implements PipeTransform {
    override transform(value: any): any {
        if (value !== null && value !== undefined) {
            const svalue = value.toString();
            // tslint:disable-next-line:prefer-const one-variable-per-declaration
            let regex = new RegExp('[^' + String.DECIMAL_SEPARATOR + '\\d]', 'g'),
                // tslint:disable-next-line:prefer-const variable-name
                number_string = svalue.replace(regex, ''),
                // tslint:disable-next-line:prefer-const
                split = number_string.split(String.DECIMAL_SEPARATOR),
                // tslint:disable-next-line:prefer-const
                rest = split[0].length % 3,
                result = split[0].substr(0, rest),
                // tslint:disable-next-line:prefer-const
                thousands = split[0].substr(rest).match(/\d{3}/g);
            if (thousands) {
                const separator = rest ? String.THOUSANDS_SEPARATOR : '';
                result += separator + thousands.join(String.THOUSANDS_SEPARATOR);
                if (value < 0) {
                    result = '-' + result;
                }
            }
            result = split[1] !== undefined ? result + String.DECIMAL_SEPARATOR + split[1] : result;
            return result;
        }
    }

}

@Pipe({
    name: 'decimalFormat'
})
export class DecimalFormat extends DecimalPipe implements PipeTransform {
    override transform(value: any): any {
        const result = super.transform(value, ClientConfig.GetResClientConfig('DecimalFormat'));
        return result !== null ? result.replace(new RegExp('[' + String.THOUSANDS_SEPARATOR + ']', 'g'), '@').replace(new RegExp('[' + String.DECIMAL_SEPARATOR + ']', 'g'), String.THOUSANDS_SEPARATOR).replace(new RegExp('[' + '@' + ']', 'g'), String.DECIMAL_SEPARATOR) : null;
    }
}
