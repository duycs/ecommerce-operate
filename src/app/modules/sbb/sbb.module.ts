import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MaterialModule } from "../../material.module";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { SharedModule } from "src/app/shared.module";
import { ProductListComponent } from "./product/product-list/product-list.component";
import { CreateProductComponent } from "./product/create-product/create-product.component";
import { ProductDetailComponent } from "./product/product-detail/product-detail.component";
import { DeleteProductComponent } from "./product/delete-product/delete-product.component";
import { UpdateProductComponent } from "./product/update-product/update-product.component";
import { SbbComponent } from "./sbb.component";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpLoaderFactory } from "src/app/app.module";
import { ReportComponent } from "./report/report.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { ShopListComponent } from "./shop/shop-list/shop-list.component";
import { ShopDetailComponent } from "./shop/shop-detail/shop-detail.component";
import { CustomerListComponent } from "./customer/customer-list/customer-list.component";
import { CustomerDetailComponent } from "./customer/customer-detail/customer-detail.component";
import { OrderListComponent } from "./order/order-list/order-list.component";
import { OrderDetailComponent } from "./order/order-detail/order-detail.component";
import { EditOrderQuantityComponent } from "./order/edit-order-quantity/edit-order-quantity.component";
import { DeleteOrderComponent } from "./order/delete-order/delete-order.component";
import { OrderDetailItemComponent } from "./order/order-detail-item/order-detail-item.component";
import { ConfirmOrderComponent } from "./order/confirm-order/confirm-order.component";
import { UpdateProductStatusComponent } from "./product/update-product-status/update-product-status.component";
import { ProductOrderListComponent } from "./product/product-order-list/product-order-list.component";
import { ProductPriceListComponent } from "./product/product-price-list/product-price-list.component";
import { UpdateProductPriceListComponent } from "./product/update-product-price-list/update-product-price-list.component";
import { CreateProductLanguageComponent } from "./product/create-product-language/create-product-language.component";
import { ProductOrderStatisticListComponent } from "./product/product-order-statistic-list/product-order-statistic-list.component";
import { OrderSubListComponent } from "./order/order-sub-list/order-sub-list.component";
import { OrderSubDetailComponent } from "./order/order-sub-detail/order-sub-detail.component";
import { OrderTransferListComponent } from "./order/order-transfer-list/order-transfer-list.component";
import { OrderEnterListComponent } from "./order/order-enter-list/order-enter-list.component";
import { OrderEnterDetailComponent } from "./order/order-enter-detail/order-enter-detail.component";
import { OrderTransferDetailComponent } from "./order/order-transfer-detail/order-transfer-detail.component";
import { CreateOrderEnterComponent } from "./order/create-order-enter/create-order-enter.component";
import { OrderDeliverListComponent } from "./order/order-deliver-list/order-deliver-list.component";
import { OrderDeliverDetailComponent } from "./order/order-deliver-detail/order-deliver-detail.component";
import { CreateOrderDeliverComponent } from "./order/create-order-deliver/create-order-deliver.component";
import { PostListComponent } from "./post/post-list/post-list.component";
import { DeletePostComponent } from "./post/delete-post/delete-post.component";
import { PostDetailComponent } from "./post/post-detail/post-detail.component";
import { CreatePostLanguageComponent } from "./post/create-post-language/create-post-language.component";
import { CustomerWaitActiveListComponent } from "./customer/customer-wait-active-list/customer-wait-active-list.component";
import { CustomerReturnProductListComponent } from "./customer/customer-return-product-list/customer-return-product-list.component";
import { CustomerOrderListComponent } from "./customer/customer-order-list/customer-order-list.component";
import { CustomerDebtConfigListComponent } from "./customer/customer-debt-config-list/customer-debt-config-list.component";
import { CustomerDebtListComponent } from "./customer/customer-debt-list/customer-debt-list.component";
import { CreateCustomerDebtConfigComponent } from "./customer/create-customer-debt-config/create-customer-debt-config.component";
import { CreateShopComponent } from "./shop/create-shop/create-shop.component";
import { UpdateShopComponent } from "./shop/update-shop/update-shop.component";
import { ShopOrderListComponent } from "./shop/shop-order-list/shop-order-list.component";
import { ShopOrderTransferListComponent } from "./shop/shop-order-transfer-list/shop-order-transfer-list.component";
import { ShopProductListComponent } from "./shop/shop-product-list/shop-product-list.component";
import { ShopDebtListComponent } from "./shop/shop-debt-list/shop-debt-list.component";
import { ShopPaidDebtListComponent } from "./shop/shop-paid-debt-list/shop-paid-debt-list.component";
import { CreateShopPaidDebtComponent } from "./shop/create-shop-paid-debt/create-shop-paid-debt.component";
import { ShopPaidDebtDetailComponent } from "./shop/shop-paid-debt-detail/shop-paid-debt-detail.component";
import { CreateMoneyAccountComponent } from "./money/create-money-account/create-money-account.component";
import { MoneyAccountListComponent } from "./money/money-account-list/money-account-list.component";
import { MoneyAccountDetailComponent } from "./money/money-account-detail/money-account-detail.component";
import { MoneyCollectListComponent } from "./money/money-collect-list/money-collect-list.component";
import { MoneyPayListComponent } from "./money/money-pay-list/money-pay-list.component";
import { MoneyReasonListComponent } from "./money/money-reason-list/money-reason-list.component";
import { CreateMoneyReasonComponent } from "./money/create-money-reason/create-money-reason.component";
import { EditMoneyReasonComponent } from "./money/edit-money-reason/edit-money-reason.component";
import { DeleteMoneyReasonComponent } from "./money/delete-money-reason/delete-money-reason.component";
import { CreateMoneyPayComponent } from "./money/create-money-pay/create-money-pay.component";
import { EditMoneyAccountComponent } from "./money/edit-money-account/edit-money-account.component";
import { MoneyCollectDetailComponent } from "./money/money-collect-detail/money-collect-detail.component";
import { MoneyPayDetailComponent } from "./money/money-pay-detail/money-pay-detail.component";
import { StaffDetailComponent } from "./staff/staff-detail/staff-detail.component";
import { StaffProfileComponent } from "./staff/staff-profile/staff-profile.component";
import { CreateStaffComponent } from "./staff/create-staff/create-staff.component";
import { EditStaffProfileComponent } from "./staff/edit-staff-profile/edit-staff-profile.component";
import { EditStaffPasswordComponent } from "./staff/edit-staff-password/edit-staff-password.component";
import { EditStaffPermissionComponent } from "./staff/edit-staff-permission/edit-staff-permission.component";
import { EditStaffMoneyAccountComponent } from "./staff/edit-staff-money-account/edit-staff-money-account.component";
import { MoneyStatisticListComponent } from "./money/money-statistic-list/money-statistic-list.component";
import { CreateMoneyCollectComponent } from "./money/create-money-collect/create-money-collect.component";
import { FundEntryListComponent } from "./money/fund-entry-list/fund-entry-list.component";
import { FundReleaseListComponent } from "./money/fund-release-list/fund-release-list.component";
import { CreateFundEntryComponent } from "./money/create-fund-entry/create-fund-entry.component";
import { CreateFundReleaseComponent } from "./money/create-fund-release/create-fund-release.component";
import { FundEntryDetailComponent } from "./money/fund-entry-detail/fund-entry-detail.component";
import { FundReleaseDetailComponent } from "./money/fund-release-detail/fund-release-detail.component";
import { ApproveOrderComponent } from "./order/approve-order/approve-order.component";
import { ConfirmOrderCompletedComponent } from "./order/confirm-order-completed/confirm-order-completed.component";
import { OrderDetailItemDialogComponent } from "./order/order-detail-item-dialog/order-detail-item-dialog.component";
import { OrderSubDetailItemDialogComponent } from "./order/order-sub-detail-item-dialog/order-sub-detail-item-dialog.component";
import { OrderDetailItemQuantityComponent } from "./order/order-detail-item-quantity/order-detail-item-quantity.component";
import { UpdateProductPriceComponent } from "./product/update-product-price/update-product-price.component";
import { TransporterDetailComponent } from "./transporter/transporter-detail/transporter-detail.component";
import { TransporterListComponent } from "./transporter/transporter-list/transporter-list.component";
import { CreateTransporterComponent } from "./transporter/create-transporter/create-transporter.component";
import { UpdateTransporterComponent } from "./transporter/update-transporter/update-transporter.component";
import { TransporterOrderListComponent } from "./transporter/transporter-order-list/transporter-order-list.component";
import { TransporterShopListComponent } from "./transporter/transporter-shop-list/transporter-shop-list.component";
import { TransporterProductListComponent } from "./transporter/transporter-product-list/transporter-product-list.component";
import { UpdatePostComponent } from "./post/update-post/update-post.component";
import { MoneyTransactionDetailComponent } from "./money/money-transaction-detail/money-transaction-detail.component";
import { MoneyDebtDetailComponent } from "./money/money-debt-detail/money-debt-detail.component";
import { CustomerDebtDetailComponent } from "./customer/customer-debt-detail/customer-debt-detail.component";
import { ProductCategoryListComponent } from "./product/product-category-list/product-category-list.component";
import { CreateProductCategoryComponent } from "./product/create-product-category/create-product-category.component";
import { UpdateProductCategoryComponent } from "./product/update-product-category/update-product-category.component";
import { TemplateTransporterCostListComponent } from "./template/template-transporter-cost-list/template-transporter-cost-list";
import { ProductCategoryDetailComponent } from "./product/product-category-detail/product-category-detail.component";
import { TemplateProductPriceListComponent } from "./template/template-product-price-list/template-product-price-list";
import { CreateTemplateProductProfitComponent } from "./template/create-template-product-profit/create-template-product-profit.component";
import { TemplateProductProfitListComponent } from "./template/template-product-profit-list/template-product-profit-list";
import { CreateTemplateTransporterCostComponent } from "./template/create-template-transporter-cost/create-template-transporter-cost.component";
import { ShopProductPriceSettingListComponent } from "./shop/shop-product-price-setting-list/shop-product-price-setting-list";
import { CreateShopProductPriceSettingComponent } from "./shop/create-shop-product-price-setting/create-shop-product-price-setting.component";
import { UpdateShopProductPriceSettingComponent } from "./shop/update-shop-product-price-setting/update-shop-product-price-setting.component";
import { UpdateTemplateProductProfitComponent } from "./template/update-template-product-profit/update-template-product-profit.component";
import { UpdateTemplateTransporterCostComponent } from "./template/update-template-transporter-cost/update-template-transporter-cost.component";
import { TemplateProductProfitDetailComponent } from "./template/template-product-profit-detail/template-product-profit-detail.component";
import { TemplateTransporterCostDetailComponent } from "./template/template-transporter-cost-detail/template-transporter-cost-detail.component";
import { ShopProductPriceSettingDetailComponent } from "./shop/shop-product-price-setting-detail/shop-product-price-setting-detail.component";
import { OrderDeliverForCustomerComponent } from "./order/order-deliver-for-customer/order-deliver-for-customer.component";
import { OrderCollectListComponent } from "./order/order-collect-list/order-collect-list.component";
import { OrderCollectDetailComponent } from "./order/order-collect-detail/order-collect-detail.component";
import { CreateProductPriceSettingComponent } from "./product/create-product-price-setting/create-product-price-setting.component";
import { ImageOrderDeliverComponent } from "./order/image-order-deliver/image-order-deliver.component";
import { ImageOrderDetailItemComponent } from "./order/image-order-detail-item/image-order-detail-item.component";
import { DownloadImagePopupComponent } from "./order/download-image-popup/download-image-popup.component";
import { StaffListComponent } from "./staff/staff-list/staff-list.component";
import { DepartmentListComponent } from "./department/department-list/department-list.component";
import { CreateDepartmentComponent } from "./department/create-department/create-department.component";
import { CreatePrinterComponent } from "./printers/create-printer/create-printer.component";
import { PrinterListComponent } from "./printers/printer-list/printer-list.component";
import { TemplateListComponent } from "./template/template-list/template-list.component";
import { TemplateDetailComponent } from "./template/template-detail/template-detail.component";
import { ProductPriceSettingListComponent } from "./template/product-price-setting-list/product-price-setting-list.component";
import { ProductGroupListComponent } from "./product/product-group-list/product-group-list.component";
import { ProductGroupDetailComponent } from "./product/product-group-detail/product-group-detail.component";
import { CreateProductGroupComponent } from "./product/create-product-group/create-product-group.component";
import { PermissionGuard } from "src/app/core/guards/permission.guard";

const routes: Routes = [
  {
    path: "sbb",
    component: SbbComponent,
    children: [
      {
        path: "reports",
        component: ReportComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "create-product-group",
        component: CreateProductGroupComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "product-groups",
        component: ProductGroupListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "product-groups/:id",
        component: ProductGroupDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "products",
        component: ProductListComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([1, 2, 3, 4, 5])],
      },
      {
        path: "products/:id",
        component: ProductDetailComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([1, 2, 3, 4, 5])],
      },
      {
        path: "products/:id/create-language",
        component: CreateProductLanguageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "product-categories",
        component: ProductCategoryListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "product-categories/:id",
        component: ProductCategoryDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "product-categories/:id/update",
        component: UpdateProductCategoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "product-orders",
        component: ProductOrderListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "product-orders/statistic",
        component: ProductOrderStatisticListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "product-prices",
        component: ProductPriceListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "product-prices/update",
        component: UpdateProductPriceListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "shops",
        component: ShopListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "shops/:id",
        component: ShopDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "shops/:id/update",
        component: UpdateShopComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "create-shop",
        component: CreateShopComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "customers",
        component: CustomerListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "customers/:id",
        component: CustomerDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "customer-wait-actives",
        component: CustomerWaitActiveListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "customer-debt-configs",
        component: CustomerDebtConfigListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "create-customer-debt-config",
        component: CreateCustomerDebtConfigComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "order-collects",
        component: OrderCollectListComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([108])],
      },
      {
        path: "order-collects/:id",
        component: OrderCollectDetailComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([108])],
      },
      {
        path: "orders",
        component: OrderListComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([6])],
      },
      {
        path: "orders/:id",
        component: OrderDetailComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([6])],
      },
      {
        path: "order-subs",
        component: OrderSubListComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([6])],
      },
      {
        path: "order-subs/:id",
        component: OrderSubDetailComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([6])],
      },
      {
        path: "order-transfers",
        component: OrderTransferListComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([9])],
      },
      {
        path: "order-transfers/:id",
        component: OrderTransferDetailComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([9])],
      },
      {
        path: "order-delivers",
        component: OrderDeliverListComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([110, 111, 112, 113])],
      },
      {
        path: "order-delivers/:id",
        component: OrderDeliverDetailComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([110, 111, 112, 113])],
      },
      {
        path: "create-order-deliver",
        component: CreateOrderDeliverComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([111])],
      },
      {
        path: "order-enters",
        component: OrderEnterListComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([10, 11, 12])],
      },
      {
        path: "order-enters/:id",
        component: OrderEnterDetailComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([10, 11, 12])],
      },
      {
        path: "create-order-enter",
        component: CreateOrderEnterComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([11, 12])],
      },
      {
        path: "posts",
        component: PostListComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([104, 105, 106])],
      },
      {
        path: "posts/:id",
        component: PostDetailComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([104, 105, 106])],
      },
      {
        path: "posts/:id/update",
        component: UpdatePostComponent,
        canActivate: [AuthGuard, PermissionGuard.forPermissions([105, 106, 107])],
      },
      {
        path: "posts/:id/create-language",
        component: CreatePostLanguageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "money-accounts",
        component: MoneyAccountListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "money-accounts/:id",
        component: MoneyAccountDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "create-money-account",
        component: CreateMoneyAccountComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "money-collects",
        component: MoneyCollectListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "create-money-collect",
        component: CreateMoneyCollectComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "money-pays",
        component: MoneyPayListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "money-statistic",
        component: MoneyStatisticListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "money-reasons",
        component: MoneyReasonListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "fund-entries",
        component: FundEntryListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "fund-entries/:id",
        component: FundEntryDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "fund-releases",
        component: FundReleaseListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "fund-releases/:id",
        component: FundReleaseDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "staffs",
        component: StaffListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "staffs/:id",
        component: StaffDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "create-staff",
        component: CreateStaffComponent,
        canActivate: [AuthGuard],
      },

      {
        path: "transporters",
        component: TransporterListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "transporters/:id",
        component: TransporterDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "create-transporter",
        component: CreateTransporterComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "transporters/:id/update",
        component: UpdateTransporterComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "templates",
        component: TemplateListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "templates/product-profits",
        component: TemplateProductProfitListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "templates/transporter-costs",
        component: TemplateTransporterCostListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "shop-product-price-settings",
        component: ShopProductPriceSettingListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "shop-product-price-settings/:id",
        component: ShopProductPriceSettingDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "create-shop-product-price-setting",
        component: CreateShopProductPriceSettingComponent,
        canActivate: [AuthGuard],
      },

      {
        path: "product-price-settings",
        component: ProductPriceSettingListComponent,
        canActivate: [AuthGuard],
      },

      {
        path: "create-product-category",
        component: CreateProductCategoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "shop-product-price-settings/:id/update",
        component: UpdateShopProductPriceSettingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "departments",
        component: DepartmentListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "create-department",
        component: CreateDepartmentComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "assets/prs",
        component: PrinterListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "assets/create-pr",
        component: CreatePrinterComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  declarations: [
    SbbComponent,
    ReportComponent,
    CreateProductGroupComponent,
    ProductGroupListComponent,
    ProductGroupDetailComponent,
    ProductListComponent,
    ProductDetailComponent,
    ProductOrderListComponent,
    ProductPriceListComponent,
    ProductPriceSettingListComponent,
    ProductOrderStatisticListComponent,
    UpdateProductPriceListComponent,
    UpdateProductPriceComponent,
    CreateProductComponent,
    CreateProductLanguageComponent,
    UpdateProductComponent,
    UpdateProductStatusComponent,
    DeleteProductComponent,
    ProductCategoryListComponent,
    CreateProductCategoryComponent,
    UpdateProductCategoryComponent,
    ProductCategoryDetailComponent,

    ShopListComponent,
    ShopDetailComponent,
    UpdateShopComponent,
    CreateShopComponent,
    ShopOrderListComponent,
    ShopOrderTransferListComponent,
    ShopProductListComponent,
    ShopDebtListComponent,
    ShopPaidDebtListComponent,
    CreateShopPaidDebtComponent,
    ShopPaidDebtDetailComponent,
    CreateShopProductPriceSettingComponent,
    ShopProductPriceSettingListComponent,
    CreateProductPriceSettingComponent,

    CustomerListComponent,
    CustomerDetailComponent,
    CustomerWaitActiveListComponent,
    CustomerDebtConfigListComponent,
    CustomerReturnProductListComponent,
    CustomerOrderListComponent,
    CustomerDebtListComponent,

    OrderListComponent,
    OrderDetailComponent,
    EditOrderQuantityComponent,
    DeleteOrderComponent,
    OrderDetailItemComponent,
    ConfirmOrderComponent,
    OrderSubListComponent,
    OrderSubDetailComponent,
    OrderTransferListComponent,
    OrderEnterListComponent,
    OrderEnterDetailComponent,
    OrderTransferDetailComponent,
    CreateOrderEnterComponent,
    OrderDeliverListComponent,
    OrderDeliverDetailComponent,
    CreateOrderDeliverComponent,
    ApproveOrderComponent,
    ConfirmOrderCompletedComponent,
    OrderDetailItemDialogComponent,
    OrderSubDetailItemDialogComponent,
    OrderDetailItemQuantityComponent,
    OrderDeliverForCustomerComponent,
    OrderCollectListComponent,
    OrderCollectDetailComponent,

    PostListComponent,
    PostDetailComponent,
    UpdatePostComponent,
    DeletePostComponent,
    CreatePostLanguageComponent,
    CreateCustomerDebtConfigComponent,

    MoneyAccountListComponent,
    CreateMoneyAccountComponent,
    MoneyAccountDetailComponent,
    MoneyCollectListComponent,
    MoneyPayListComponent,
    MoneyReasonListComponent,
    CreateMoneyReasonComponent,
    EditMoneyReasonComponent,
    DeleteMoneyReasonComponent,
    CreateMoneyPayComponent,
    EditMoneyAccountComponent,
    MoneyCollectDetailComponent,
    MoneyPayDetailComponent,
    MoneyTransactionDetailComponent,
    MoneyDebtDetailComponent,
    CustomerDebtDetailComponent,

    StaffListComponent,
    StaffDetailComponent,
    StaffProfileComponent,
    CreateStaffComponent,
    EditStaffProfileComponent,
    EditStaffPasswordComponent,
    EditStaffPermissionComponent,
    EditStaffMoneyAccountComponent,
    MoneyStatisticListComponent,
    CreateMoneyCollectComponent,
    FundEntryListComponent,
    FundReleaseListComponent,
    CreateFundEntryComponent,
    CreateFundReleaseComponent,
    FundReleaseDetailComponent,
    FundEntryDetailComponent,

    TransporterListComponent,
    TransporterDetailComponent,
    CreateTransporterComponent,
    TransporterOrderListComponent,
    TransporterShopListComponent,
    TransporterProductListComponent,
    UpdateTransporterComponent,

    TemplateTransporterCostListComponent,
    TemplateProductPriceListComponent,
    CreateTemplateProductProfitComponent,
    TemplateProductProfitListComponent,
    CreateTemplateTransporterCostComponent,
    UpdateShopProductPriceSettingComponent,
    UpdateTemplateProductProfitComponent,
    UpdateTemplateTransporterCostComponent,
    TemplateProductProfitDetailComponent,
    TemplateTransporterCostDetailComponent,
    TemplateListComponent,
    TemplateDetailComponent,
    ShopProductPriceSettingDetailComponent,
    ImageOrderDeliverComponent,
    ImageOrderDetailItemComponent,
    DownloadImagePopupComponent,

    DepartmentListComponent,
    CreateDepartmentComponent,
    PrinterListComponent,
    CreatePrinterComponent,
  ],
  imports: [
    SharedModule,
    MaterialModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    RouterModule.forChild(routes),
  ],
  providers: [AuthGuard],
  bootstrap: [SbbComponent],
})
export class SbbModule {}
