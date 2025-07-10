import { Injectable } from '@angular/core';
import { TransferHttp } from '../transfer-http/transfer-http';
import { LinkSettings } from '../../shared/linksetting/LinkSetting';
import { map } from 'rxjs/operators';
import { RepositoryModel } from '../../models/repository_base';
import { LoginRegister } from '../../models/response-models/login-register-respone';
import { SocialUser } from '@abacritt/angularx-social-login';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageConfig } from '../../shared/clientconfig/localstorageconfig';

@Injectable({ providedIn: 'root' })
export class AuthenticationServices {
    loginDataUpdate$ = new BehaviorSubject<LoginRegister>(new LoginRegister());

    constructor(
        private transferHttp: TransferHttp
    ) {
    }

    registerUser(email: string, password: string, name: string, phone: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Authentication', 'RegisterUser', email, password, name, phone);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<LoginRegister>) => res));
    }

    loginNormalAccount(email: string, password: string) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Authentication', 'LoginNormalAccount', email, password);
        return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<LoginRegister>) => res));
    }

    loginWithGoogle(model: SocialUser) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Authentication', 'LoginWithGoogle');
        return this.transferHttp.post(ApiUrl, model).pipe(map((res: RepositoryModel<LoginRegister>) => res));
    }

    loginWithFaceBook(model: SocialUser) {
        const ApiUrl = LinkSettings.GetResLinkSetting('Authentication', 'LoginWithFaceBook');
        return this.transferHttp.post(ApiUrl, model).pipe(map((res: RepositoryModel<LoginRegister>) => res));
    }

    updateAfterLogin(dataLogin: LoginRegister) {
        this.loginDataUpdate$.next(dataLogin);
    }

    getDataUploadAfterLogin(): Observable<LoginRegister> {
        return this.loginDataUpdate$.asObservable();
    }

    isCheckMemberAccount(): boolean {
        let dataGetValueUser = LocalStorageConfig.GetUser();
        return dataGetValueUser != null;
    }

    logoutWithAccount() {
        let valueCurrentUser = 'currentUser';
        LocalStorageConfig.RemoveUser(valueCurrentUser);
    }
}
