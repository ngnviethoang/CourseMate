//https://github.com/sevensc/typescript-string-operations/tree/master/dist

export class String {
    static DECIMAL_SEPARATOR = '.';
    static THOUSANDS_SEPARATOR = ',';

    public static Empty = '';
    public static WhiteSpace = ' ';
    public static Null = null;
    public static EmptyArray = [];
    public static InitInt = 0;

    public static IsContainLetters(value: string) {
        return /^[a-zA-Z]+$/.test(value);
    }

    public static IsContainNumbers(value: string) {
        return /[\d\s\._\-_\,]+/g.test(value);
    }

    public static IsEmailFormat(value: string) {
        const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        return (value.length > 5 && EMAIL_REGEXP.test(value));
    }

    public static IsNullOrWhiteSpace(value: string): boolean {
        try {
            if (value == null || value === 'undefined') {
                return true;
            }
            return value.toString().replace(/\s/g, '').length < 1;
        } catch (e) {
            return false;
        }
    }

    public static Join(delimiter: string, ...args: (string | object | Array<any>)[]): string {
        try {
            const firstArg = args[0];
            if (Array.isArray(firstArg) || firstArg instanceof Array) {
                let tempString = String.Empty;

                for (let i = 0; i < firstArg.length; i++) {
                    const current = firstArg[i];
                    if (i < firstArg.length - 1) {
                        tempString += current + delimiter;
                    } else {
                        tempString += current;
                    }
                }

                return tempString;
            } else if (typeof firstArg === 'object') {
                let tempString = String.Empty;
                const objectArg = firstArg;
                const keys = Object.keys(firstArg);
                keys.forEach(element => {
                    tempString += (objectArg as any)[element] + delimiter;
                });
                tempString = tempString.slice(0, tempString.length - delimiter.length);
                return tempString;
            }
            const stringArray = args as string[];

            return String.join(delimiter, ...stringArray);
        } catch (e) {
            return String.Empty;
        }
    }

    public static FormatInputNumber(arg: any): string {
        const svalue = arg.toString();
        // tslint:disable-next-line:prefer-const
        let regex = new RegExp('[^' + this.DECIMAL_SEPARATOR + '\\d]', 'g');
        // tslint:disable-next-line:prefer-const variable-name
        const number_string = svalue.replace(regex, '');
        // tslint:disable-next-line:prefer-const
        const split = number_string.split(this.DECIMAL_SEPARATOR);
        // tslint:disable-next-line:prefer-const
        const rest = split[0].length % 3;
        let result = split[0].substr(0, rest);
        // tslint:disable-next-line:prefer-const
        const thousands = split[0].substr(rest).match(/\d{3}/g);
        if (thousands) {
            const separator = rest ? this.THOUSANDS_SEPARATOR : '';
            result += separator + thousands.join(this.THOUSANDS_SEPARATOR);
            if (arg < 0) {
                result = '-' + result;
            }
        }
        return result = split[1] !== undefined ? result + this.DECIMAL_SEPARATOR + split[1] : result;
    }


    public static ConvertInputNumber(arg: string): number {
        return parseFloat(arg.replace(new RegExp('[' + String.THOUSANDS_SEPARATOR + ']', 'g'), '').replace(new RegExp('[' + String.DECIMAL_SEPARATOR + ']', 'g'), String.THOUSANDS_SEPARATOR));
    }

    public static Format(format: string, ...args: any[]): string {
        try {
            // tslint:disable-next-line:only-arrow-functions
            return format.replace(/{(\d+(:\w*)?)}/g, function(match, i) {
                const s = match.split(':');
                if (s.length > 1) {
                    i = i[0];
                    match = s[1].replace('}', '');
                }
                let arg = args[0][i];
                if (arg == null || arg === undefined || match.match(/{d+}/)) {
                    return arg;
                }

                arg = String.parsePattern(match, arg);
                return typeof arg !== 'undefined' && arg != null ? arg : String.Empty;
            });
        } catch (e) {
            return String.Empty;
        }
    }

    public static FormatNumber(arg: number): string {
        try {
            const c = '-';
            let sarg = arg.toString();
            let firstChar = '';

            if (sarg[0] === c) {
                firstChar = c;
                sarg = sarg.substring(1, sarg.length);
            }

            const spls = sarg.split(String.THOUSANDS_SEPARATOR);
            const result = spls[0].replace(new RegExp(String.THOUSANDS_SEPARATOR, 'g'), function(c: any, i: any, a: any) {
                return i && c !== String.DECIMAL_SEPARATOR && ((a.length - i) % 3 === 0) ? String.THOUSANDS_SEPARATOR + c : c;
            });

            return firstChar + result + (spls.length === 2 ? String.DECIMAL_SEPARATOR + spls[1] : '');
        } catch (e) {
            return String.Empty;
        }
    }


    public static FormatDateTime(arg: Date): string {
        return arg.toLocaleString('en-GB').replace(',', '');
    }

    public static FormatDecimalToDate(input: number) {
        const getYear = (input.toString()).substr(0, 4) + '-';
        const getMonth = (input.toString()).substr(4, 2) + '-';
        const date = (input.toString()).substr(6, 2);
        return getYear + getMonth + date;

    }

    public static ConvertWordSearch(inputString: string) {
        let resultConvert: string;
        resultConvert = inputString.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
        return resultConvert;

    }

    private static parsePattern(match: 'L' | 'U' | 'd' | 's' | 'n' | string, arg: string | Date | number | any): string {
        switch (match) {
            case 'L':
                arg = arg.toLowerCase();
                return arg;
            case 'U':
                arg = arg.toUpperCase();
                return arg;
            case 'd':
                if (typeof (arg) === 'string') {
                    return String.getDisplayDateFromString(arg);
                } else if (arg instanceof Date) {
                    return String.Format('{0:00}.{1:00}.{2:0000}', arg.getDate(), arg.getMonth(), arg.getFullYear());
                }
                break;
            case 's':
                if (typeof (arg) === 'string') {
                    return String.getSortableDateFromString(arg);
                } else if (arg instanceof Date) {
                    return String.Format('{0:0000}-{1:00}-{2:00}', arg.getFullYear(), arg.getMonth(), arg.getDate());
                }
                break;
            case 'n':
                const replacedString = arg.replace(/,/g, '.');
                if (isNaN(parseFloat(replacedString)) || replacedString.length <= 3) {
                    break;
                }

                const numberparts = replacedString.split(/[^0-9]+/g);
                let parts = numberparts;

                if (numberparts.length > 1) {
                    parts = [String.join('', ...(numberparts.splice(0, numberparts.length - 1))), numberparts[numberparts.length - 1]];
                }

                const integer = parts[0];

                const mod = integer.length % 3;
                let output = (mod > 0 ? (integer.substring(0, mod)) : String.Empty);
                const firstGroup = output;
                const remainingGroups = integer.substring(mod).match(/.{3}/g);
                output = output + '.' + String.Join('.', remainingGroups);
                arg = output + (parts.length > 1 ? ',' + parts[1] : '');
                return arg;
            default:
                break;
        }

        if ((typeof (arg) === 'number' || !isNaN(arg)) && !isNaN(+match) && !String.IsNullOrWhiteSpace(arg)) {
            return String.formatNumber(arg, match);
        }

        return arg;
    }

    private static getDisplayDateFromString(input: string): string {
        let splitted: string[];
        splitted = input.split('-');

        if (splitted.length <= 1) {
            return input;
        }

        let day = splitted[splitted.length - 1];
        const month = splitted[splitted.length - 2];
        const year = splitted[splitted.length - 3];
        day = day.split('T')[0];
        day = day.split(' ')[0];

        return `${day}.${month}.${year}`;
    }

    private static getSortableDateFromString(input: string): string {
        const splitted = input.replace(',', '').split('.');
        if (splitted.length <= 1) {
            return input;
        }

        const times = splitted[splitted.length - 1].split(' ');
        let time = String.Empty;
        if (times.length > 1) {
            time = times[times.length - 1];
        }

        const year = splitted[splitted.length - 1].split(' ')[0];
        const month = splitted[splitted.length - 2];
        const day = splitted[splitted.length - 3];
        let result = `${year}-${month}-${day}`;

        if (!String.IsNullOrWhiteSpace(time) && time.length > 1) {
            result += `T${time}`;
        } else {
            result += 'T00:00:00';
        }

        return result;
    }

    private static formatNumber(input: number, formatTemplate: string): string {
        const count = formatTemplate.length;
        const stringValue = input.toString();
        if (count <= stringValue.length) {
            return stringValue;
        }

        let remainingCount = count - stringValue.length;
        remainingCount += 1;
        return new Array(remainingCount).join('0') + stringValue;
    }

    private static join(delimiter: string, ...args: string[]): string {
        let temp = String.Empty;
        for (let i = 0; i < args.length; i++) {
            if ((typeof args[i] === 'string' && String.IsNullOrWhiteSpace(args[i])) || (typeof args[i] !== 'number' && typeof args[i] != 'string')) {
                continue;
            }

            const arg = '' + args[i];
            temp += arg;
            for (let i2 = i + 1; i2 < args.length; i2++) {
                if (String.IsNullOrWhiteSpace(args[i2])) {
                    continue;
                }

                temp += delimiter;
                i = i2 - 1;
                break;
            }
        }
        return temp;
    }
}

export class StringBuilder {
    public Values: string[] = [];

    constructor(value: string = String.Empty) {
        this.Values = new Array(value);
    }

    public ToString() {
        return this.Values.join('');
    }

    public Append(value: string) {
        this.Values.push(value);
    }

    public AppendFormat(format: string, ...args: any[]) {
        this.Values.push(String.Format(format, ...args));
    }

    public Clear() {
        this.Values = [];
    }
}
