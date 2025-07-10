import { InformationManualBankingModel } from './infomation-banking';
import { PurchaseDetailsModel } from './purchase-details';

export class PurchaseOrder {
    idStudent?: number;
    contentTranferBanking?: string;
    totalPrice?: number;
    discountAmount?: number;
    purcharseStatus?: string;
    purcharseCode?: string;
    purchaseDate?: Date;
    listPurchaseCourseDetails?: PurchaseDetailsModel[];
    infoBanking?: InformationManualBankingModel;
}
