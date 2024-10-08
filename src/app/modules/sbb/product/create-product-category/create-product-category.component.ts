import { Component, Inject, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from 'src/app/shared/config.service';
import { ProductService } from 'src/app/services/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { TemplateService } from 'src/app/services/template.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-product-category',
  templateUrl: './create-product-category.component.html',
})

export class CreateProductCategoryComponent implements OnInit {
  form!: FormGroup;
  status: any[] = [
    { value: "true", name: "Hoạt động" },
    { value: "false", name: "Không hoạt động" },
  ];
  categories: any = [];
  name!: string;
  code!: string;
  suggestName: string = '';
  suggestCode: string = '';

  templateProfits!: any[];
  transporterCostTemplates!: any[];
  templateTransporterCosts!: any[];
  shops!: any[];
  shopSettings!: any[];

  transporterCostSettingDataSource = new MatTableDataSource<any>([]);
  transporterCostDisplayedColumns = ['numbericalOrder', 'templateName', 'cost', 'description', 'action']

  productProfitSettingDataSource = new MatTableDataSource<any>([]);
  productProfitDisplayedColumns = ['numbericalOrder', 'shopName', 'percentProfit', 'moneyProfit', 'templateProfit', 'description', 'action']

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private alertService: AlertService,
    private productService: ProductService,
    private templateService: TemplateService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      isActive: ["true"],
      description: [null],
      transporterCostSettings: this.fb.array([]),
      productProfitSettings: this.fb.array([])
    });

    this.templateService.getTemplates({ type: 1 }, 0, 1000).subscribe((res: any) => {
      this.templateProfits = res;
    });

    this.initTemplateTransporterCosts();
    this.initShopSettingTemplateProfits();

    this.getCategories();
  }

  initTemplateTransporterCosts() {
    this.templateService.getTemplates({ type: 2 }, 0, 1000).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.templateTransporterCosts = res;
        this.form.setControl('transporterCostSettings', this.templateService.getNewTemplateTransporterCostByTemplateAsFormArray(this.templateTransporterCosts));
        this.transporterCostSettingDataSource.data = this.transporterCostSettings.controls;
      }
    });
  }

  initShopSettingTemplateProfits() {
    this.templateService.getShopWithSettings({ type: 1 }, 0, 1000).subscribe((res: any) => {
      console.log(res);
      if (res && res.length > 0) {
        this.shopSettings = res;
        this.form.setControl('productProfitSettings', this.templateService.getTemplateProfuctProfitByShopAsFormArray(this.shopSettings));
        this.productProfitSettingDataSource.data = this.productProfitSettings.controls;
      }
    })
  }

  get transporterCostSettings(): FormArray {
    return this.form.get('transporterCostSettings') as FormArray;
  }

  get productProfitSettings(): FormArray {
    return this.form.get('productProfitSettings') as FormArray;
  }


  removeTransporterCost(element: any) {
    this.transporterCostSettings.controls = this.transporterCostSettings.controls.filter((s: any) => s.value.id !== element.value.id);
    this.transporterCostSettingDataSource.data = this.transporterCostSettings.controls;
  }

  removeProductProfit(element: any) {
    this.productProfitSettings.controls = this.productProfitSettings.controls.filter((s: any) => s.value.id !== element.value.id);
    this.productProfitSettingDataSource.data = this.productProfitSettings.controls;
  }


  getCategories(field: string = '', value: string = '') {
    let queryParams: any = {};
    if (field === 'name') {
      queryParams.name = value;
    }

    if (field === 'code') {
      queryParams.code = value;
    }

    this.productService.getProductCategories(queryParams, 0, 1000)
      .subscribe((res: any) => {
        this.categories = res.data;
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  outputCode(event: any) {
    this.code = event.value;
    console.log(this.code);
    this.getCategories("code", this.code);
  }

  outputName(event: any) {
    this.name = event.value;
    this.getCategories("name", this.name);
  }

  save(): void {
    let data = {
      code: this.code,
      name: this.name,
      isActive: this.form.get("isActive")?.value,
      description: this.form.get("description")?.value
    };

    this.productService.createProductCategory(data)
      .subscribe((res: any) => {
        this.alertService.showToastMessage(`Tạo danh mục ${data.code}`);

        this.updateTemplateTransporterCategoryCost(res.id, res.name);

      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  updateTemplateTransporterCategoryCost(categoryId: any, categoryName: any) {

    let transporterCostSettings = this.transporterCostSettings.controls.map(c => c.value)
      .filter((c: any) => c.cost && c.cost > 0);

    let templateTransporterCostIds = transporterCostSettings.map(c => c.templateId);
    let templateTransporterCosts = this.templateTransporterCosts.filter((c: any) => templateTransporterCostIds.includes(c.id));

    for (let i = 0; i < templateTransporterCosts.length; ++i) {
      if (typeof (templateTransporterCosts[i].settings) === 'string') {
        templateTransporterCosts[i].settings = JSON.parse(templateTransporterCosts[i].settings);
      }

      let setting = transporterCostSettings.find((o: any) => o.templateId === templateTransporterCosts[i].id);

      if (setting) {
        templateTransporterCosts[i].settings.categoryCosts.push({
          id: this.configService.getNewUid(),
          categoryId: categoryId,
          categoryName: categoryName,
          cost: ~~setting.cost,
          currency: setting.currency ?? 'VND',
          description: setting.description
        });
      }
    };


    if (templateTransporterCosts && templateTransporterCosts.length > 0) {
      this.templateService.createTeamplates(templateTransporterCosts).subscribe((res: any) => {
        this.alertService.showToastMessage(`Cập nhật các template chi phí vận chuyển theo danh mục ${categoryName}`);

        console.log(res);

        this.updateShopSettingByCategoryProfits(categoryId, categoryName, res);
      });
    }

  }

  updateShopSettingByCategoryProfits(categoryId: any, categoryName: any, templateTransporterCosts: any) {

    let shopProductProfitSettings = this.productProfitSettings.controls.map(c => c.value)
      .filter((c: any) => c.percentProfit || c.moneyProfit || c.templateProfit);

    let shopProductProfitSettingIds = shopProductProfitSettings.map((c: any) => c.shopId);

    let shopSettings = this.shopSettings.filter((c: any) => shopProductProfitSettingIds.includes(c.shopId));

    if (shopSettings) {
      for (let i = 0; i < shopSettings.length; ++i) {

        if (typeof (shopSettings[i].settings) === 'string') {
          shopSettings[i].settings = JSON.parse(shopSettings[i].settings);
        }

        let setting = shopProductProfitSettings.find((o: any) => o.shopId === shopSettings[i].shopId);

        if (setting) {
          let templateProfit = this.templateProfits.find(c => c.id === setting?.templateProfit);
          if (templateProfit && templateProfit.settings && typeof (templateProfit.settings) == 'string') templateProfit.settings = JSON.parse(templateProfit.settings);

          let categoryProfit: any = {
            id: this.configService.getNewUid(),
            categoryId: categoryId,
            categoryName: categoryName,
            percentProfit: ~~setting?.percentProfit,
            moneyProfit: ~~setting?.moneyProfit,
            templateProfit: templateProfit,
            currency: setting?.currency ?? "VND",
            description: setting?.description
          };

          shopSettings[i].settings.templateProductProfit.settings.categoryProfits.push(categoryProfit);

          let templateTransporterCost = templateTransporterCosts.find((c: any) => c.id === shopSettings[i].settings.templateTransporterCost.id);
          if (templateTransporterCost) {
            console.log("update template transporter cost: ", templateTransporterCost);
            if (typeof (templateTransporterCost.settings) === 'string') templateTransporterCost.settings = JSON.parse(templateTransporterCost.settings);

            shopSettings[i].settings.templateTransporterCost = templateTransporterCost;
          }
        }

      }
    }

    console.log(shopSettings);

    if (shopSettings && shopSettings.length > 0) {
      this.templateService.createShopSettings(shopSettings).subscribe((res: any) => {
        this.alertService.showToastMessage(`Cập nhật cài đặt cho NCC ${shopSettings.map(c => c.shopName).join(', ')}`);
        console.log(res)

        // final redirect
        this.router.navigateByUrl('/sbb/product-categories');
      });
    }

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

}
