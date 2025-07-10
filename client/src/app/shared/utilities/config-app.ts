import { Config } from '../../models/config';


export class ConfigForApp {
    public static isLoadingButton: boolean;

    public static getConfig(): Array<Config> {
        return [
            { key: 'pageIndex', value: 1 },
            { key: 'pageSize', value: 10 }
        ];
    }

    public static getStatus(): Array<Config> {
        return [
            { key: '0', value: 'Không hoạt động' },
            { key: '1', value: 'Hoạt động' },
            { key: '3', value: 'Tất cả' }
        ];
    }

    public static getCodeOfNumber(): Array<Config> {
        return [
            { key: '0', value: 'I' },
            { key: '1', value: 'II' },
            { key: '2', value: 'III' },
            { key: '3', value: 'IV' },
            { key: '4', value: 'V' },
            { key: '5', value: 'VI' },
            { key: '6', value: 'VII' },
            { key: '7', value: 'VII' },
            { key: '8', value: 'IX' },
            { key: '9', value: 'X' }
        ];
    }
}
