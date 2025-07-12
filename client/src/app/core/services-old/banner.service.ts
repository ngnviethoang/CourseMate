import { Injectable } from '@angular/core';
import { TransferHttp } from '../transfer-http/transfer-http';
import { Banner } from '../../models/banner';
import { LinkSettings } from '../../shared/linksetting/LinkSetting';
import { map } from 'rxjs/operators';
import { RepositoryModel } from '../../models/repository_base';

@Injectable({ providedIn: 'root' })
export class BannerServices {
    constructor(
        private transferHttp: TransferHttp
    ) {
    }

    createBanner(model: Banner) {
        const ApiUrl = LinkSettings.GetResLinkSetting('MasterData', 'CreateBanner');
        return this.transferHttp.post(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    updateStatusBanner(model: Banner) {
        const ApiUrl = LinkSettings.GetResLinkSetting('MasterData', 'UpdateStatusBanner', model.id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    updateBanner(model: Banner) {
        const ApiUrl = LinkSettings.GetResLinkSetting('MasterData', 'UpdateBanner', model.id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    getBanners() {
        const ApiUrl = LinkSettings.GetResLinkSetting('MasterData', 'GetBanners');
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<Banner[]>) => res));
    }
}
