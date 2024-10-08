import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { FormArray, FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { AccountantService } from 'src/app/services/accountant.service';
import { ConfigService } from 'src/app/shared/config.service';
import { ProductService } from 'src/app/services/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { TemplateService } from 'src/app/services/template.service';
import { ShopService } from 'src/app/services/shop.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-product-category',
  templateUrl: './update-product-category.component.html',
})

export class UpdateProductCategoryComponent implements OnInit {
  form!: FormGroup;
  id!: any;
  category: any;
  status: any[] = [
    { value: "true", name: "Hoạt động" },
    { value: "false", name: "Không hoạt động" },
  ];
  name!: string;
  code!: string;
  suggestName: string = '';
  suggestCode: string = '';

  categories: any = [];
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
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'];

    this.form = this.fb.group({
      isActive: ['true', Validators.required],
      description: ['']
    });


    this.productService.getProductCategory(this.id).subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.category = res;
        this.name = this.category.name;
        this.code = this.category.code;
        this.form.get('isActive')?.setValue(this.category.isActive + "");
        this.form.get('description')?.setValue(this.category.description);
      }
    });

    this.templateService.getTemplates({ type: 1 }, 0, 1000).subscribe((res: any) => {
      this.templateProfits = res;
    });

    this.initTemplateTransporterCostByCategory(this.id);
    this.initShopSettingTemplateProfitByCategory(this.id);

    this.getCategories();

  }


  // save(): void {
  //   let data = {
  //     name: this.form.get('name')?.value,
  //     code: this.form.get('code')?.value,
  //     isActive: this.form.get("isActive")?.value,
  //     description: this.form.get("description")?.value
  //   };

  //   this.productService.updateProductCategory(this.id, data)
  //     .subscribe(() => {
  //       this.alertService.showToastSuccess();
  //       this.router.navigateByUrl('/sbb/product-categories');
  //     }, (err) => {
  //       this.alertService.showToastError();
  //       console.log(err);
  //     });
  // }

  initTemplateTransporterCostByCategory(categoryId: any) {

    this.templateService.getTemplates({ type: 2 }, 0, 1000).subscribe((res: any) => {
      if (res && res.length > 0) {
        res.forEach((c: any) => {
          if (typeof (c.settings) === 'string') c.settings = JSON.parse(c.settings);
        });

        let settings: any[] = [];

        for (let i = 0; i < res.length; ++i) {
          let categorySetting = res[i].settings.categoryCosts.find((c: any) => c.categoryId == categoryId);
          if (categorySetting) {
            settings.push({
              id: categorySetting.id,
              templateId: res[i].id,
              templateName: res[i].name,
              cost: ~~categorySetting.cost,
              description: categorySetting.description,
              currency: categorySetting.currency ?? 'VND'
            })
          }
        }

        this.templateTransporterCosts = res;
        this.form.setControl('transporterCostSettings', this.templateService.getTemplateTransporterCostByTemplateAsFormArray(settings));
        this.transporterCostSettingDataSource.data = this.transporterCostSettings.controls;
      }
    });
  }

  initShopSettingTemplateProfitByCategory(categoryId: any) {

    this.templateService.getShopWithSettings({ type: 1 }, 0, 1000).subscribe((res: any) => {

      if (res && res.length > 0) {
        let settings: any[] = [];

        for (let i = 0; i < res.length; ++i) {
          if (typeof (res[i].settings) === 'string') res[i].settings = JSON.parse(res[i].settings);

          let setting = res[i].settings.templateProductProfit.settings.categoryProfits.find((c: any) => c.categoryId === categoryId);

          if (setting) {
            settings.push({
              id: setting.id,
              shopId: res[i].shopId,
              shopName: res[i].shopName,
              moneyProfit: setting.moneyProfit == 0 ? null : setting.moneyProfit,
              percentProfit: setting.percentProfit == 0 ? null : setting.percentProfit,
              templateProfit: setting?.templateProfit?.id,
              currency: setting.currency ?? 'VND',
              description: setting.description
            });
          } else {
            // other shop not setting
            settings.push({
              id: this.configService.getNewUid(),
              shopId: res[i].shopId,
              shopName: res[i].shopName,
              moneyProfit: null,
              percentProfit: null,
              templateProfit: null,
              currency: 'VND',
              description: null
            });
          }

        };

        //console.log(settings);
        this.shopSettings = res;

        this.form.setControl('productProfitSettings', this.templateService.getShopProfuctProfitBySettingAsFormArray(settings));
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

    this.productService.updateProductCategory(this.id, data)
      .subscribe((res: any) => {
        this.alertService.showToastMessage(`Cập nhật danh mục ${data.code}`);

        this.updateTemplateTransporterCategoryCost(this.id, this.category.name);

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
        let categoryCost: any = {
          id: this.configService.getNewUid(),
          categoryId: categoryId,
          categoryName: categoryName,
          cost: ~~setting.cost,
          currency: setting.currency ?? 'VND',
          description: setting.description
        };

        // exist shop setting then replace else push new
        let index = templateTransporterCosts[i].settings.categoryCosts.findIndex((c: any) => c.categoryId == categoryCost.categoryId);
        if (index > 0) {
          templateTransporterCosts[i].settings.categoryCosts[index] = categoryCost;
        } else {
          templateTransporterCosts[i].settings.categoryCosts.push(categoryCost);
        }

      }
    };

    console.log(templateTransporterCosts);

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

          // replace exist or add new
          let index = shopSettings[i].settings.templateProductProfit.settings.categoryProfits.findIndex((c: any) => c.categoryId == categoryProfit.categoryId);
          if (index > 0) {
            shopSettings[i].settings.templateProductProfit.settings.categoryProfits[index] = categoryProfit;
          } else {
            shopSettings[i].settings.templateProductProfit.settings.categoryProfits.push(categoryProfit);
          }

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

}

