import { String } from './string';

export class ConvertData {
    // public convertDecimalToDate(dateTime: number): string {
    //   let stringDateFinal: string;
    //   // * Convert to string.
    //   const stringDate = String(dateTime);
    //   const year = stringDate.substr(0, 4);
    //   const month = stringDate.substr(4, 2);
    //   const date = stringDate.substr(6, 2);
    //   const hours = stringDate.substr(8, 2);
    //   const minutes = stringDate.substr(10, 2);
    //   const second = stringDate.substr(12, 2);
    //   const tik = stringDate.substr(14, 3);
    //   stringDateFinal = year + '-' + month + '-' + date + 'T' + hours + ':' + minutes + ':' + second + '.' + tik + 'Z';
    //   return stringDateFinal;
    // }

    public static convertDateToString(dateTime: Date): string {
        let stringDate = String.Empty;
        if (dateTime != null) {
            const fullYear = dateTime.getFullYear();
            const fullMonth = dateTime.toISOString().substr(0, 19).substr(5, 2);
            const fullDate = dateTime.getDate();
            stringDate = fullYear + '-' + fullMonth + '-' + fullDate;
        } else {
            stringDate = String.Empty;
        }
        return stringDate;
    }

    public static calculatorYearCurrent(): string {
        const dateTime = new Date();
        const yearCurrent = dateTime.getFullYear();
        return yearCurrent.toString() + '-' + (yearCurrent + 1).toString();
    }
}
