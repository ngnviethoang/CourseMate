import { String } from '../utilities/string';
import * as jsonData from '../../../assets/document/reslink-api.json';

export class LinkSettings {
    public static GetResLinkSetting(pGroup: string, pFunction: string, ...pParams: any[]) {
        const resLinkSetting: any = jsonData;
        const link = resLinkSetting[pGroup][pFunction];
        return String.Format(link, pParams);
    }
}
