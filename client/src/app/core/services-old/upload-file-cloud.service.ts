import { Injectable } from '@angular/core';
import { TransferHttp } from '../transfer-http/transfer-http';
import { LinkSettings } from '../../shared/linksetting/LinkSetting';
import { RepositoryModel } from '../../models/repository_base';
import { map } from 'rxjs/operators';
import { FilemanagerModel } from '../../models/file-manager.model';

@Injectable({ providedIn: 'root' })
export class UploadFileCloudServices {
    constructor(
        private transferHttp: TransferHttp
    ) {
    }

    deleteImageOnCloud(publicId: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('UploadDataCloud', 'DeleteFileOnCloud', publicId);
        return this.transferHttp.delete(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    createFileSoftware(model: FilemanagerModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('UploadDataCloud', 'CreateFileSoftware');
        return this.transferHttp.post(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    updateInformationSoftware(model: FilemanagerModel) {
        const ApiUrl = LinkSettings.GetResLinkSetting('UploadDataCloud', 'UpdateInformationSoftware', model.id);
        return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    }

    getListFileSoftware() {
        const ApiUrl = LinkSettings.GetResLinkSetting('UploadDataCloud', 'GetListFileSoftware');
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<FilemanagerModel[]>) => res));
    }

}
