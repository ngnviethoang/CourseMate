import { Injectable } from '@angular/core';
import { TransferHttp } from '../transfer-http/transfer-http';
import { LinkSettings } from '../../shared/linksetting/LinkSetting';
import { map } from 'rxjs/operators';
import { CategoryModel } from '../../models/category';
import { RepositoryModel } from '../../models/repository_base';

@Injectable({ providedIn: 'root' })
export class CategoryServices {
    constructor(
        private transferHttp: TransferHttp
    ) {
    }

    createCategories(model: CategoryModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('MasterData', 'CreateCategory');
        return this.transferHttp.post(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    updateStatusCategories(model: CategoryModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('MasterData', 'UpdateStatusCategory', model.id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    updateInformationCategories(model: CategoryModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('MasterData', 'UpdateInformationCategory', model.id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    deleteCategories(id: number) {
        const ApiUrl = LinkSettings.GetResLinkSetting('MasterData', 'DeleteCategory', id);
        return this.transferHttp.putUrl(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }


    getCategories() {
        const ApiUrl = LinkSettings.GetResLinkSetting('MasterData', 'GetCategory');
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<CategoryModel[]>) => res));
    }
}
