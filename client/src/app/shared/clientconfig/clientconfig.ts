export class ClientConfig {
    private static resClientConfig: any = require('../../../assets/document/client-config.json');
    private static charSplit = ';';
    private static keyClientConfig = 'ClientConfig';

    public static GetResClientConfig(pKey: string) {
        return this.resClientConfig[this.keyClientConfig][pKey];
    }

    public static GetPageSizeOptions(): Array<string> {
        const value = this.resClientConfig[this.keyClientConfig].PageSizeOptions;
        return value.split(this.charSplit);
    }

    public static GetPageLabel(): string {
        return this.resClientConfig[this.keyClientConfig].PageLabel;
    }

    public static GetFunction(): string {
        return this.resClientConfig[this.keyClientConfig].Function;
    }


}

