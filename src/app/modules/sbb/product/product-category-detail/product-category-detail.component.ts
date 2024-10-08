import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigService } from 'src/app/shared/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { MatTableDataSource } from '@angular/material/table';
import { TemplateService } from 'src/app/services/template.service';
import { ShopProductDataSource } from '../../shop/shop-product-list/shop-product-data-source';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-product-category-detail',
  templateUrl: './product-category-detail.component.html',
})

export class ProductCategoryDetailComponent implements OnInit {
  id!: any;
  category!: any;

  shopCategoryProfitSettingDataSource = new MatTableDataSource<any>([]);
  transporterCostSettingDataSource = new MatTableDataSource<any>([]);
  displayedColumns = ["numbericalOrder", "template", 'cost', 'description'];

  constructor(
    private alertService: AlertService,
    private configService: ConfigService,
    private productService: ProductService,
    private templateService: TemplateService,
    private fb: FormBuilder,
    private router: Router,
    private mappingModels: MappingModels,
    private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'];
    this.getCaterogy();
    this.initTemplateTransporterCostByCategory(this.id);
    this.initShopSettingTemplateProfitByCategory(this.id);
  }

  getCaterogy(){
    this.productService.getProductCategory(this.id).subscribe((res: any) => {
      this.category = res;
      this.category = this.mappingModels.MappingStatusChip(res);
    });
  }
  
  initTemplateTransporterCostByCategory(categoryId: any) {
    
    this.templateService.getTemplates({ type: 2 }, 0, 1000).subscribe((res: any) => {
      if (res && res.length > 0) {
        res.forEach((c: any) => {
          if (typeof (c.settings) === 'string') c.settings = JSON.parse(c.settings);
        });

        let templateTransporterCostSettings: any[] = [];

        for (let i = 0; i < res.length; ++i) {
          let categorySetting = res[i].settings.categoryCosts.find((c: any) => c.categoryId == categoryId);
          if (categorySetting) {
            templateTransporterCostSettings.push({
              id: categorySetting.id,
              templateId: res[i].id,
              templateName: res[i].name,
              cost: ~~categorySetting.cost,
              description: categorySetting.description,
              currency: categorySetting.currency ?? 'VND'
            })
          }
        }

        this.transporterCostSettingDataSource.data = templateTransporterCostSettings;
      }
    });
  }

  initShopSettingTemplateProfitByCategory(categoryId: any) {
    this.templateService.getShopWithSettings({ type: 1 }, 0, 1000).subscribe((res: any) => {

      if (res && res.length > 0) {
        let shopCategoryProfitSettings: any[] = [];

        for (let i = 0; i < res.length; ++i) {
          if (typeof (res[i].settings) === 'string') res[i].settings = JSON.parse(res[i].settings);

          let setting = res[i].settings.templateProductProfit.settings.categoryProfits.find((c: any) => c.categoryId === categoryId);

          if (setting) {
            shopCategoryProfitSettings.push({
              id: setting.id,
              shopId: res[i].shopId,
              shopName: res[i].shopName,
              moneyProfit: setting.moneyProfit == 0 ? null : setting.moneyProfit,
              percentProfit: setting.percentProfit == 0 ? null : setting.percentProfit,
              templateProfit: setting?.templateProfit,
              currency: setting.currency ?? 'VND',
              description: setting.description
            });
          }
        };

        this.shopCategoryProfitSettingDataSource.data = shopCategoryProfitSettings;
      }
    })
  }

  update() {
    this.router.navigateByUrl(`/sbb/product-categories/${this.id}/update`)
  }

  setActive() {
    this.productService.activeProductCategory(this.category.id).subscribe(() => {
        this.alertService.success(`Danh mục ${this.category.name} ở trạng thái hoạt động`);
        this.getCaterogy();
    }, (err) => {
        this.alertService.showToastError();
        console.log(err);
    });
}

setInactive() {
    this.productService.inactiveProductCategory(this.category.id).subscribe(() => {
        this.alertService.success(`Danh mục ${this.category.name} ở trạng thái không hoạt động`);
        this.getCaterogy();
    }, (err) => {
        this.alertService.showToastError();
        console.log(err);
    });
}

}