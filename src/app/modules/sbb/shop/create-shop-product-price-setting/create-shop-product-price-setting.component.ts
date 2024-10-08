import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from 'src/app/shared/config.service';
import { TemplateService } from 'src/app/services/template.service';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from 'src/app/services/shop.service';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-create-shop-product-price-setting',
  templateUrl: './create-shop-product-price-setting.component.html',
})

export class CreateShopProductPriceSettingComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  category: any = [];
  shops: any = [];
  templateProfits!: any[];
  templateTransporterCosts!: any[];
  templateTransporterCostFilteredOptions: Observable<any[]> | undefined;
  productProfitSettingDataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['numbericalOrder', 'category', 'percentProfit', 'moneyProfit', 'templateProfit', 'description', 'action']

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private productService: ProductService,
    private alertService: AlertService,
    private templateService: TemplateService,
    private shopService: ShopService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
  }


  ngOnInit(): void {

    let shopId = this.activatedRoute.snapshot.queryParams['shopId'];

    this.initShops();

    this.form = this.fb.group({
      shopId: [shopId ?? null, Validators.required],
      description: [null],
      templateTransporterCost: [null, Validators.required],
      productProfitSetting: this.fb.array([])
    });

    this.initSettingsByCategory();

    this.templateTransporterCostFilteredOptions = this.form.get('templateTransporterCost')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value || '')),
    );
  }

  private _filter(value: any): string[] {
    const filterValue = value.toLowerCase();

    return this.templateTransporterCosts.filter(option => option.code.toLowerCase().includes(filterValue));
  }

  initShops() {
    this.shopService.getShops({} as any, 0, 10000).subscribe((pageData) => {
      this.shops = pageData.data;
    });
  }

  initSettingsByCategory() {
    this.productService.getProductCategories({}, 0, 1000).subscribe((res: any) => {
      if (res && res.data && res.data.length > 0) {
        this.form.setControl('productProfitSetting', this.templateService.getNewTemplateProfuctProfitByCategoryAsFormArray(res.data));
        this.productProfitSettingDataSource.data = this.productProfitSettings.controls;
      }
    });

    this.templateService.getTemplates({ type: 1 }, 0, 1000).subscribe((data: any) => {
      if (data) {
        this.templateProfits = data;
        this.templateProfits.forEach((c: any) => {
          c.settings = JSON.parse(c.settings);
        });
      }
    });

    this.templateService.getTemplates({ type: 2 }, 0, 1000).subscribe((data: any) => {
      this.templateTransporterCosts = data;
    });
  }

  get productProfitSettings(): FormArray {
    return this.form.get('productProfitSetting') as FormArray;
  }

  createSetting(id: any): FormGroup {
    return new FormGroup({
      id: new FormControl(id),
      percentProfit: new FormControl(),
      moneyProfit: new FormControl(),
      templateProfit: new FormControl()
    })
  }

  save(): void {
    let code = this.configService.createCode(10);
    let shopId = this.form.get('shopId')?.value;

    let categoryProfitSettings = this.productProfitSettings.value.
      filter((s: any) => s.percentProfit || s.moneyProfit || s.templateProfit);

    for (let i = 0; i < categoryProfitSettings.length; ++i) {
      if (categoryProfitSettings[i].templateProfit) {
        let templateProfitId = categoryProfitSettings[i].templateProfit;
        categoryProfitSettings[i].templateProfit = this.templateProfits.find(c => c.id === templateProfitId);
      }
    }

    // tạo template lợi nhuận theo danh mục sản phẩm này trước rồi gắn vào shop
    let templateProductProfit = {
      type: 3, // templateProductProfit
      name: `Template product profit_${code}`,
      code: `TPP_${code}`,
      description: `Template TPP_${code} set product profit of shop ${shopId}`,
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
    let shopId = this.form.get('shopId')?.value;
    let templateTransporterCost = this.templateTransporterCosts.find((c: any) => c.code == this.form.get('templateTransporterCost')?.value);
    if (typeof (templateTransporterCost.settings) == "string") {
      templateTransporterCost.settings = JSON.parse(templateTransporterCost.settings);
    }

    let data = {
      type: 1, // templateProductPrice
      shopId: shopId,
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

        this.updateSalePrice(shopId);

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