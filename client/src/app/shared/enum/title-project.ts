export enum TitleProject {
    PRODUCTCODE = 'PR',
    REFERENCECODE = 'RC',
    CUSTOMERCODE = 'CU',
    VENDORCODE = 'VD',
    SALEORDERCODE = 'SO',
    P001 = 'P001',
    P002 = 'P002'

}

export enum TitleComponent {
    ADDCUSTOMER = 'Thêm Khách Hàng',
    ADDVENDOR = 'Thêm Nhà Cung Cấp',
    IMPORTPRODUCT = 'Import file Mã Sản Phẩm',
    IMPORTCUSTOMER = 'Import file Khách Hàng',
    IMPORTVENDOR = 'Import file Nhà Cung Cấp',
    REFESHPRODUCT = 'Cập Nhật Product',
    INPORTSUCCESS = 'Cập nhật dữ liệu vào hệ thống thành công',
    Active = 'Hoạt Động',
    InActive = 'Ngừng Hoạt Động'

}

export enum TypeProductProject {
    P001 = 'Mã hàng bán',
    P002 = 'Mã hàng bảo hành'
}

export enum Status {
    Active = 1,
    InActive = 0,
    SearchResult = -1

}


export enum TitleReport {
    REPORTCUSTOMER = 'Báo cáo danh sách khách hàng',
    REPORTVENDOR = 'Báo cáo danh sách nhà cung cấp'
}

export enum PlaceNotification {
    bottomRight = 'bottomRight'
}

export enum TitleMessenger {
    PurchaseOrder = 'Đơn nhập hàng'
}

export enum ContentMessenger {
    PurchaseOrder = 'Tạo đơn nhập hàng thành công...!',
    ErrorPurchaseOrder = 'Không thể tạo đơn hàng trên hệ thống, vui lòng kiểm tra log...!'
}


export enum StatusBEReturn {
    CREATESUSS = 201,
    QUERRYSUSS = 200,
    NOTFOUND = 204
}

