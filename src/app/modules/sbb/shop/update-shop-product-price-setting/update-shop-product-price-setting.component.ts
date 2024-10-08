import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from 'src/app/shared/config.service';
import { TemplateService } from 'src/app/services/template.service';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-shop-product-price-setting',
  templateUrl: './update-shop-product-price-setting.component.html',
})

export class UpdateShopProductPriceSettingComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  id!: any;
  data!: any;
  templateProfits!: any[];
  templateTransporterCosts!: any[];
  productProfitSettingDataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['numbericalOrder', 'category', 'percentProfit', 'moneyProfit', 'templateProfit', 'description', 'action']

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private productService: ProductService,
    private alertService: AlertService,
    private templateService: TemplateService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngAfterViewInit(): void {
  }


  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];

    this.form = this.fb.group({
      description: [null],
      templateTransporterCost: [null, Validators.required],
      templateProductProfit: this.fb.array([])
    });

    this.initSettingsByCategory();
  }

  initSettingsByCategory() {
    this.productService.getProductCategories({}, 0, 1000).subscribe((res: any) => {
      if (res && res.data && res.data.length > 0) {

        this.templateService.getShopSetting(this.id).subscribe((data: any) => {
          this.data = data;
          this.data.settings = JSON.parse(this.data.settings);
          this.data = this.templateService.mappingShopSetting(this.data, res.totalRecords);

          let categoryIds: any = [];
          try {
            categoryIds = this.data.settings.templateProductProfit.settings.categoryProfits.map((c: any) => c.categoryId);
          } catch {

          }

          let mixCategories = res.data.filter((c: any) => !categoryIds.includes(c.id))
            .map((c: any) => {
              return {
                categoryId: c.id, categoryName: c.name,
                percentProfit: null, moneyProfit: null, templateProfit: null,
                description: null, currency: 'VND'
              }
            });

          if (this.data.settings.templateProductProfit.settings.categoryProfits && this.data.settings.templateProductProfit.settings.categoryProfits.length > 0) {
            for (let i = 0; i < this.data.settings.templateProductProfit.settings.categoryProfits.length; ++i) {
              let c = this.data.settings.templateProductProfit.settings.categoryProfits[i];

              console.log(c.templateProfit?.id);

              mixCategories.unshift(
                {
                  categoryId: c.categoryId, categoryName: c.categoryName,
                  percentProfit: c.percentProfit, moneyProfit: c.moneyProfit, templateProfit: c.templateProfit?.id,
                  description: c.description, currency: c.currency
                }
              );
            };
          }

          this.form.get('description')?.setValue(this.data.description);
          this.form.get('templateTransporterCost')?.setValue(this.data.settings.templateTransporterCost.id);
          this.form.setControl('productProfit', this.templateService.getTemplateProfuctProfitByCategoryProfitAsFormArray(mixCategories));
          this.productProfitSettingDataSource.data = this.productProfitSettings.controls;
        });
      }
    });

    this.templateService.getTemplates({ type: 2 }, 0, 1000).subscribe((res: any) => {
      console.log(res);
      if (res) {
        this.templateTransporterCosts = res;
      }
    });

    this.templateService.getTemplates({ type: 1 }, 0, 1000).subscribe((res: any) => {
      if (res) {
        this.templateProfits = res;
        this.templateProfits.forEach((c: any) => {
          c.settings = JSON.parse(c.settings);
        });
      }
    });
  }

  get productProfitSettings(): FormArray {
    return this.form.get('productProfit') as FormArray;
  }

  save(): void {
    let code = this.configService.createCode(10);

    let categoryProfitSettings = this.productProfitSettings.value.
      filter((s: any) => s.percentProfit || s.moneyProfit || s.templateProfit);

    for (let i = 0; i < categoryProfitSettings.length; ++i) {
      if (categoryProfitSettings[i].templateProfit) {
        let templateProfitId = categoryProfitSettings[i].templateProfit;
        categoryProfitSettings[i].templateProfit = this.templateProfits.find(c => c.id === templateProfitId);
      }
    }

    // cập nhật template lợi nhuận theo danh mục sản phẩm này trước rồi gắn vào shop
    let templateProductProfit = {
      id: this.data.settings.templateProductProfit.id,
      type: 3, // templateProductProfit
      name: `Template product profit_${code}`,
      code: `TPP_${code}`,
      description: `Template TPP_${code} set product profit of shop ${this.data.shopId}`,
      settings: {
        categoryProfits: categoryProfitSettings
      }
    };

    this.templateService.createTeamplates([templateProductProfit]).subscribe((c: any) => {
      console.log('created template product profit', c);

      if (c) {
        if (typeof (c[0].settings) == 'string')
          c[0].settings = JSON.parse(c[0].settings);

        this.createProductPriceSetting(c[0]);
      }
    });
  }

  createProductPriceSetting(templateProductProfit: any) {
    let templateTransporterCost = this.templateTransporterCosts.find(c => c.id === this.form.get('templateTransporterCost')?.value);
    templateTransporterCost.settings = JSON.parse(templateTransporterCost.settings);

    let data = {
      id: this.data.id,
      type: 1, // templateProductPrice
      shopId: this.data.shopId,
      description: this.form.get("description")?.value,
      settings: {
        templateProductProfit: templateProductProfit,
        templateTransporterCost: templateTransporterCost
      }
    };

    console.log("create shop settings", data);

    this.templateService.createShopSettings([data])
      .subscribe(() => {
        this.alertService.showToastSuccess();

        this.updateSalePrice(this.data.shopId);

        this.router.navigateByUrl('/sbb/shop-product-price-settings');
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  remove(element: any) {
    this.productProfitSettings.controls = this.productProfitSettings.controls.filter((s: any) => s.value.id !== element.value.id);
    this.productProfitSettingDataSource.data = this.productProfitSettings.controls;
  }

  createSetting(id: any): FormGroup {
    return new FormGroup({
      id: new FormControl(id),
      percentProfit: new FormControl(),
      moneyProfit: new FormControl(),
      templateProfit: new FormControl()
    })
  }

  addSetting() {
    if (this.productProfitSettings.controls.length == 0) {
      this.productProfitSettings.push(this.createSetting(this.configService.getNewUid()));
    } else {
      this.alertService.showToastMessage("Cần nhập chi phí");
    }
    this.productProfitSettingDataSource.data = this.productProfitSettings.controls;
  }

  getLastCost() {
    return this.productProfitSettings.controls.map(c => c.value).slice(-1)[0].cost;
  }

  changePercentProfit(element: any) {
    this.productProfitSettings.controls.find((s: any) => s.value.id === element.value.id)?.get('moneyProfit')?.setValue(null);
    this.productProfitSettings.controls.find((s: any) => s.value.id === element.value.id)?.get('templateProfit')?.setValue(null);
  }

  changeMoneyProfit(element: any) {
    this.productProfitSettings.controls.find((s: any) => s.value.id === element.value.id)?.get('percentProfit')?.setValue(null);
    this.productProfitSettings.controls.find((s: any) => s.value.id === element.value.id)?.get('templateProfit')?.setValue(null);
  }

  changeTemplateProfit(element: any) {
    this.productProfitSettings.controls.find((s: any) => s.value.id === element.value.id)?.get('percentProfit')?.setValue(null);
    this.productProfitSettings.controls.find((s: any) => s.value.id === element.value.id)?.get('moneyProfit')?.setValue(null);
  }

  updateSalePrice(shopId: any) {
    let data: any = {
      ShopIds: [shopId],
      ProductIds: [] // update sale price for all product of shop
    };

    this.templateService.updateSalePrices(data)
      .subscribe((totalUpdated: any) => {
        this.alertService.showToastMessage(`Đã cập nhật giá cho ${totalUpdated} sản phẩm`);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

}