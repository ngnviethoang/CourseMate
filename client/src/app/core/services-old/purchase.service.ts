import { Injectable } from '@angular/core';
import { TransferHttp } from '../transfer-http/transfer-http';
import { LinkSettings } from '../../shared/linksetting/LinkSetting';
import { map } from 'rxjs/operators';
import { RepositoryModel } from '../../models/repository_base';
import { PurchaseOrder } from '../../models/purchase';
import { InformationManualBankingModel } from '../../models/infomation-banking';

@Injectable({ providedIn: 'root' })
export class PurchaseServices {
    constructor(
        private transferHttp: TransferHttp
    ) {
    }

    genPurchaseOrder(idStudent: number) {
        const ApiUrl = LinkSettings.GetResLinkSetting('PurchaseOrder', 'GenPurchaseOrder', idStudent);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<string>) => res));

    }

    createRequestPurchase(model: PurchaseOrder) {
        const ApiUrl = LinkSettings.GetResLinkSetting('PurchaseOrder', 'CreateRequestPurchase');
        return this.transferHttp.post(ApiUrl, model).pipe(map((res: RepositoryModel<PurchaseOrder>) => res));
    }

    getInformationOfBanking() {
        const ApiUrl = LinkSettings.GetResLinkSetting('MasterData', 'GetListInformationManualBanking');
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<InformationManualBankingModel>) => res));
    }

    isCheckPurchaseCourse(idCourse: number) {
        const ApiUrl = LinkSettings.GetResLinkSetting('PurchaseOrder', 'IsCheckCoursePurchase', idCourse);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));

    }

}
