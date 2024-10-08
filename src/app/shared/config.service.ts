import { formatCurrency, getCurrencySymbol } from "@angular/common";
import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Permission } from "./permission";

@Injectable()
export class ConfigService {
  constructor() {}

  get authApiURI() {
    return `${environment.ssoUrl}/web`;
  }

  get resourceApiURI() {
    return `${environment.apiUrl}`;
  }

  getNewUid() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: any) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  getCurrencyDisplay(
    value: any,
    currencyCode: string = environment.currency,
    display: "code" | "symbol" | "symbol-narrow" | string | boolean = "symbol",
    // digitsInfo: string = '3.2-2',
    locale: string = "en-VN"
  ): string | null {
    let currencyValue = this.getCurrencyValue(value);

    return formatCurrency(
      currencyValue,
      locale,
      getCurrencySymbol(currencyCode, "wide"),
      currencyCode
      // digitsInfo,
    );
  }

  getCurrencyValue(value: any) {
    if (!value || value == "") return 0;

    if (typeof value == "number") return value;

    return Number(value.replace(/[^0-9\.-]+/g, ""));
  }

  public createApiImagePath = (path: string) => {
    return `${environment.srcUrl}/${path}`;
  };

  public createSsoImagePath = (path: string) => {
    return `${environment.ssoSrc}/${path}`;
  };

  public nameToCode(str: any) {
    str = this.getNoWhiteSpace(this.removeSpecialCharacters(str));
    return str;
  }

  public getNoWhiteSpace(str: any) {
    return str.replace(/\s/g, "");
  }

  public removeSpecialCharacters(str: any) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      " "
    );
    return str;
  }

  public createCode(length: number) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  public getYears() {
    return [
      2000, 2001, 2002, 2003, 2004, 2005, 2005, 2007, 2008, 2009, 2010, 2011,
      2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
    ];
  }

  getDefaultPhoto() {
    return "/assets/images/default.png";
  }

  getDefaultUserPhoto() {
    return "/assets/images/profile-user.png";
  }

  getCurrencyInEnglishWord(s: any) {
    var th_val = ["", "thousand", "million", "billion", "trillion"];
    var dg_val = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ];
    var tn_val = [
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ];
    var tw_val = [
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];
    s = s.toString();
    s = s.replace(/[\, ]/g, "");
    if (s != parseFloat(s)) return "not a number ";
    var x_val = s.indexOf(".");
    if (x_val == -1) x_val = s.length;
    if (x_val > 15) return "too big";
    var n_val = s.split("");
    var str_val = "";
    var sk_val = 0;
    for (var i = 0; i < x_val; i++) {
      if ((x_val - i) % 3 == 2) {
        if (n_val[i] == "1") {
          str_val += tn_val[Number(n_val[i + 1])] + " ";
          i++;
          sk_val = 1;
        } else if (n_val[i] != 0) {
          str_val += tw_val[n_val[i] - 2] + " ";
          sk_val = 1;
        }
      } else if (n_val[i] != 0) {
        str_val += dg_val[n_val[i]] + " ";
        if ((x_val - i) % 3 == 0) str_val += "hundred ";
        sk_val = 1;
      }
      if ((x_val - i) % 3 == 1) {
        if (sk_val) str_val += th_val[(x_val - i - 1) / 3] + " ";
        sk_val = 0;
      }
    }
    if (x_val != s.length) {
      var y_val = s.length;
      str_val += "point ";
      for (let i = x_val + 1; i < y_val; i++) str_val += dg_val[n_val[i]] + " ";
    }
    return str_val.replace(/\s+/g, " ");
  }

  getCurrencyInVietnamWord(s: any) {
    var th_val = ["", "nghìn", "triệu", "tỉ", "nghìn tỉ"];
    var dg_val = [
      "không",
      "một",
      "hai",
      "ba",
      "bốn",
      "năm",
      "sáu",
      "bảy",
      "tám",
      "chín",
    ];
    var tn_val = [
      "mười",
      "mười một",
      "mười hai",
      "mười ba",
      "mười bốn",
      "mười năm",
      "mười sáu",
      "mười bảy",
      "mười tám",
      "mười chín",
    ];
    var tw_val = [
      "hai mươi",
      "ba mươi",
      "bốn mươi",
      "năm mươi",
      "sáu mươi",
      "bảy mươi",
      "tám mươi",
      "chín mươi",
    ];
    s = s.toString();
    s = s.replace(/[\, ]/g, "");
    if (s != parseFloat(s)) return "lỗi, không phải là một số ";
    var x_val = s.indexOf(".");
    if (x_val == -1) x_val = s.length;
    if (x_val > 15) return "...";
    var n_val = s.split("");
    var str_val = "";
    var sk_val = 0;
    for (var i = 0; i < x_val; i++) {
      if ((x_val - i) % 3 == 2) {
        if (n_val[i] == "1") {
          str_val += tn_val[Number(n_val[i + 1])] + " ";
          i++;
          sk_val = 1;
        } else if (n_val[i] != 0) {
          str_val += tw_val[n_val[i] - 2] + " ";
          sk_val = 1;
        }
      } else if (n_val[i] != 0) {
        str_val += dg_val[n_val[i]] + " ";
        if ((x_val - i) % 3 == 0) str_val += "trăm ";
        sk_val = 1;
      }
      if ((x_val - i) % 3 == 1) {
        if (sk_val) str_val += th_val[(x_val - i - 1) / 3] + " ";
        sk_val = 0;
      }
    }
    if (x_val != s.length) {
      var y_val = s.length;
      str_val += "đồng ";
      for (let i = x_val + 1; i < y_val; i++) str_val += dg_val[n_val[i]] + " ";
    }
    return str_val.replace(/\s+/g, " ").trim();
  }

  getAllPermissions(permissions: any = null) {
    if (permissions == null) permissions = this.getPermissions();
    return permissions
      .map((p: any) => p.permissions)
      .flat(1)
      .map((c: any) => c.id);
  }

  getAllGroupPermissions(permissions: any = null) {
    if (permissions == null) permissions = this.getPermissions();
    return this.getPermissions().map((p: any) => p.id);
  }

  getPermissions() {
    return this.PERMISION_DATA;
  }

  PERMISION_DATA: any[] = [
    //Product
    {
      name: "Sản phẩm",
      code: "Product",
      id: 1,
      permissions: [
        { name: "Xem sản phẩm", code: "ProductRead", id: 1 },
        { name: "Thêm sản phẩm", code: "ProductWrite", id: 2 },
        { name: "Xóa sản phẩm", code: "ProductDelete", id: 3 },
        { name: "Xem giá", code: "PriceRead", id: 4 },
        { name: "Cài đặt giá", code: "PriceSetting", id: 5 },
      ],
    },

    //CustomerOrder
    {
      name: "Đơn khách đặt",
      code: "CustomerOrder",
      id: 2,
      permissions: [
        { name: "Xem đơn khách đặt", code: "CustomerOrderRead", id: 6 },
        { name: "Xác nhận đơn hàng", code: "CustomerOrderApprove", id: 7 },
        { name: "Hủy bỏ đơn hàng", code: "CustomerOrderCancel", id: 8 },
      ],
    },

    //DeliveryOrder
    {
      name: "Đơn giao hàng",
      code: "DeliveryOrder",
      id: 3,
      permissions: [
        { name: "Xem đơn giao hàng", code: "DeliveryOrderRead", id: 9 },
      ],
    },

    // Import Receipt
    {
      name: "Đơn nhập hàng",
      code: "ImportReceipt",
      id: 4,
      permissions: [
        { name: "Xem đơn nhập hàng", code: "ImportReceiptRead", id: 10 },
        { name: "Thêm đơn nhập hàng", code: "ImportReceiptWrite", id: 11 },
        { name: "Sửa đơn nhập hàng", code: "ImportReceiptEdit", id: 12 },
        {
          name: "ImportReceiptReadAdvanced",
          code: "ImportReceiptReadAdvanced",
          id: 13,
        },
      ],
    },

    //ExportReceipt
    {
      name: "Đơn xuất hàng",
      code: "ExportReceipt",
      id: 5,
      permissions: [
        { name: "Xem đơn xuất hàng", code: "ExportReceiptRead", id: 14 },
        { name: "Thêm đơn xuất hàng", code: "ExportReceiptWrite", id: 15 },
        {
          name: "Xác nhận đơn xuất hàng",
          code: "ExportReceiptApprove",
          id: 16,
        },
      ],
    },

    // Supplier
    {
      name: "Nhà cung cấp",
      code: "Supplier",
      id: 6,
      permissions: [
        { name: "Xem NCC", code: "SupplierRead", id: 17 },
        { name: "SupplierReadAdvanced", code: "SupplierReadAdvanced", id: 18 },
        { name: "Thêm NCC", code: "SupplierWrite", id: 19 },
        { name: "Sửa NCC", code: "SupplierEdit", id: 20 },
        { name: "Thanh toán công nợ NCC", code: "SupplierPayDebt", id: 21 },
      ],
    },

    // Staff
    {
      name: "Nhân viên",
      code: "Staff",
      id: 7,
      permissions: [
        { name: "Xem nhân viên", code: "StaffRead", id: 22 },
        { name: "Thêm nhân viên", code: "StaffWrite ", id: 23 },
        { name: "Sửa nhân viên", code: "StaffEdit ", id: 24 },
        { name: "Xóa nhân viên", code: "StaffDelete ", id: 25 },
      ],
    },

    // Permission
    {
      name: "Phân quyền",
      code: "PermissionGroup",
      id: 8,
      permissions: [
        { name: "Xem nhóm quyền", code: "PermissionGroupRead", id: 26 },
        { name: "Thêm nhóm quyền", code: "PermissionGroupWrite", id: 27 },
        { name: "Sửa nhóm quyền", code: "PermissionGroupEdit", id: 28 },
        { name: "Xóa nhóm quyền", code: "PermissionGroupDelete", id: 29 },
      ],
    },

    //Supplier
    // Product
    {
      name: "Sản phẩm NCC",
      code: "SupplierProduct",
      id: 9,
      permissions: [
        { name: "Xem sản phẩm NCC", code: "SupplierProductRead", id: 100 },
        { name: "Tạo sản phẩm NCC", code: "SupplierProductCreate", id: 101 },
        { name: "Sửa sản phẩm NCC", code: "SupplierProductEdit", id: 102 },
        { name: "Xóa sản phẩm NCC", code: "SupplierProductDelete", id: 103 },
      ],
    },

    // NewFeed
    {
      name: "Bài đăng",
      code: "SupplierNewFeed",
      id: 10,
      permissions: [
        { name: "Xem bài đăng", code: "SupplierNewFeedRead", id: 104 },
        { name: "Thêm bài đăng", code: "SupplierNewFeedWrite", id: 105 },
        { name: "Sửa bài đăng", code: "SupplierNewFeedEdit", id: 106 },
        { name: "Xóa bài đăng", code: "SupplierNewFeedDelete", id: 107 },
      ],
    },

    // Order
    {
      name: "Đơn hàng NCC",
      code: "SupplierOrder",
      id: 11,
      permissions: [
        { name: "Xem đơn hàng NCC", code: "SupplierOrderRead", id: 108 },
      ],
    },

    // Orderd Product
    {
      name: "Đơn đặt hàng sản phẩm NCC",
      code: "SupplierOrderedProduct",
      id: 12,
      permissions: [
        {
          name: "Xem đơn đặt hàng sản phẩm NCC",
          code: "SupplierOrderedProductRead",
          id: 109,
        },
      ],
    },

    // Delivery Order
    {
      name: "Đơn giao hàng NCC",
      code: "SupplierDeliveryOrder",
      id: 13,
      permissions: [
        {
          name: "Xem đơn giao hàng NCC",
          code: "SupplierDeliveryOrderRead",
          id: 110,
        },
        {
          name: "Tạo đơn giao hàng NCC",
          code: "SupplierDeliveryOrderCreate",
          id: 111,
        },
        {
          name: "Sửa đơn giao hàng NCC",
          code: "SupplierDeliveryOrderEdit",
          id: 112,
        },
        {
          name: "Xóa đơn giao hàng NCC",
          code: "SupplierDeliveryOrderDelete",
          id: 113,
        },
      ],
    },

    // Report
    {
      name: "Báo cáo NCC",
      code: "SupplierReport",
      id: 14,
      permissions: [
        { name: "Xem báo cáo NCC", code: "SupplierReportRead", id: 114 },
      ],
    },

    // Liability
    {
      name: "Nợ NCC",
      code: "SupplierLiability",
      id: 15,
      permissions: [
        { name: "Xem nợ NCC", code: "SupplierLiabilityRead ", id: 115 },
      ],
    },

    // Staff
    {
      name: "Nhân viên NCC",
      code: "SupplierStaff",
      id: 16,
      permissions: [
        { name: "Xem nhân viên NCC", code: "SupplierStaffRead", id: 116 },
        { name: "Thêm nhân viên NCC", code: "SupplierStaffWrite", id: 117 },
        { name: "Sửa nhân viên NCC", code: "SupplierStaffEdit", id: 118 },
        { name: "Xóa nhân viên NCC", code: "SupplierStaffDelete", id: 119 },
      ],
    },
  ];
}
