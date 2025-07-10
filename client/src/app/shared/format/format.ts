import moment from 'moment';

export class Format {

    public static setDecimalDate(date: any) {
        const Moment = moment(date);
        return (Moment.year().toString() + (Moment.month() + 1 < 10 ? '0' +
                (Moment.month() + 1).toString() : (Moment.month() + 1).toString()) +
            (Moment.date() < 10 ? '0' + Moment.date().toString() : Moment.date().toString()) + '000000000');
    }


    public static setDecimalEndDate(date: any) {
        const Moment = moment(date);
        return (Moment.year().toString() + (Moment.month() + 1 < 10 ? '0' +
                (Moment.month() + 1).toString() : (Moment.month() + 1).toString()) +
            (Moment.date() < 10 ? '0' + Moment.date().toString() : Moment.date().toString()) + '235900000');
    }

    public static setDateToString(date: any) {
        const Moment = moment(date);
        return (Moment.year().toString() + '-' + (Moment.month() + 1 < 10 ? '0' +
                (Moment.month() + 1).toString() : (Moment.month() + 1).toString()) + '-' +
            (Moment.date() < 10 ? '0' + Moment.date().toString() : Moment.date().toString()));
    }

    public static formatDDMMYYYY(date: any) {
        const Moment = moment(date);
        return ((Moment.date() < 10 ? '0' + Moment.date().toString() : Moment.date().toString()) + '/' +
            (Moment.month() + 1 < 10 ? '0' + (Moment.month() + 1).toString() : (Moment.month() + 1).toString()) + '/' +
            Moment.year().toString());
    }

    public static getDD(date: any) {
        const Moment = moment(date);
        return Moment.date() < 10 ? '0' + Moment.date().toString() : Moment.date().toString();
    }

    public static getMM(date: any) {
        const Moment = moment(date);
        return Moment.month() + 1 < 10 ? '0' + (Moment.month() + 1).toString() : (Moment.month() + 1).toString();
    }

    public static getYYYY(date: any) {
        const Moment = moment(date);
        return Moment.year().toString();
    }

    public static addDays(date: any, days: any) {
        return moment(date, 'DD-MM-YYYY').add(days, 'days').format('DD/MM/YYYY');
    }

    public static getFull(date: any) {
        return moment(date).format('YYYYMMDDHHmmssSSS');
    }


    public static getDateTime(date: any) {
        return moment(date).format('YYYYMMDD');
    }

    public static getDatePrint(date: any) {
        return moment(date).format('DD/MM/YYYY HH:mm');
    }

    // tslint:disable-next-line: variable-name
    public static numberConvert(number: number) {
        const parts = number.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }
}
