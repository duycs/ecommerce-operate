import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';
import { TemplateService } from 'src/app/services/template.service';
import { ConfigService } from 'src/app/shared/config.service';


@Component({
    selector: 'app-create-product-price-setting',
    templateUrl: './create-product-price-setting.component.html',
    styleUrls: ['./create-product-price-setting.component.css']
})

export class CreateProductPriceSettingComponent implements OnInit {
    form!: FormGroup;
    product!: any;
    templateProfits!: any[];
    templateTransporterCosts!: any[];
    templateTransporterCostFilteredOptions: Observable<any[]> | undefined;
    productProfitSettingDataSource = new MatTableDataSource<any>([]);
    displayedColumns = ['categoryName', 'percentProfit', 'moneyProfit', 'templateProfit', 'description'];
    productSetting!: any; // add new if null or update if exist templateId

    constructor(private fb: FormBuilder,
        private productService: ProductService,
        private configService: ConfigService,
        private alertService: AlertService,
        private templateService: TemplateService,
        private router: Router,
        public dialogRef: MatDialogRef<CreateProductPriceSettingComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    };

    ngOnInit(): void {
        this.product = this.data;

        console.log(this.product);

        this.form = this.fb.group({
            productId: [this.product.id ?? null, Validators.required],
            description: [null],
            templateTransporterCost: [null, Validators.required],
            productProfitSetting: this.fb.array([])
        });

        this.initSettingsByProduct(this.product);

        this.templateTransporterCostFilteredOptions = this.form.get('templateTransporterCost')?.valueChanges.pipe(
            startWith(''),
            map((value: any) => this._filter(value || '')),
        );

        let queryParams: any = { shopId: this.product.shopId };
        this.templateService.getShopSettings(queryParams).subscribe((res: any) => {
            if (res) {
                let shopSetting = res[0];
                shopSetting.settings = typeof (shopSetting.settings) === 'string' ? JSON.parse(shopSetting.settings) : shopSetting.settings;
                console.log(shopSetting);

                if (shopSetting.settings.templateTransporterCost.code) {
                    this.form.get('templateTransporterCost')?.setValue(shopSetting.settings.templateTransporterCost.code);
                    this.form.get('templateTransporterCost')?.disable();
                }
            }
        })
    };


    private _filter(value: any): string[] {
        const filterValue = value.toLowerCase();

        return this.templateTransporterCosts.filter(option => option.code.toLowerCase().includes(filterValue));
    }

    getNewSettingAsFormArray(settings: any[]) {
        const fgs = settings.map((setting: any) => {
            return new FormGroup({
                id: new FormControl(this.configService.getNewUid()),
                productId: new FormControl(setting.productId),
                productName: new FormControl(setting.productName),
                categoryId: new FormControl(setting.categoryId),
                categoryName: new FormControl(setting.categoryName),
                percentProfit: new FormControl(null),
                moneyProfit: new FormControl(null),
                currency: new FormControl(setting.currency ?? 'VND'),
                templateProfit: new FormControl(null),
                description: new FormControl(null)
            });
        });

        return new FormArray(fgs);
    }

    getSettingAsFormArray(settings: any[]) {
        const fgs = settings.map((setting: any) => {
            return new FormGroup({
                id: new FormControl(setting.id),
                productId: new FormControl(setting.productId),
                productName: new FormControl(setting.productName),
                categoryId: new FormControl(setting.categoryId),
                categoryName: new FormControl(setting.categoryName),
                percentProfit: new FormControl(setting.percentProfit),
                moneyProfit: new FormControl(setting.moneyProfit),
                currency: new FormControl(setting.currency ?? 'VND'),
                templateProfit: new FormControl(setting?.templateProfit?.id),
                description: new FormControl(setting.description)
            });
        });

        return new FormArray(fgs);
    }

    initSettingsByProduct(product: any) {
        console.log(product.id);

        // product setting
        this.templateService.getProductSettings({ productIds: [product.id] }, 0, 1000).subscribe(
            {
                next: (res: any) => {
                    if (res && res.length > 0) {

                        // update setting
                        this.productSetting = res[0];

                        if (typeof (res[0].settings) === 'string') res[0].settings = JSON.parse(res[0].settings);

                        let profitSetting = res[0].settings.templateProductProfit.settings.profits[0];

                        let settings: any[] = [
                            {
                                id: profitSetting.id,
                                productId: profitSetting.productId,
                                productName: profitSetting.productName,
                                categoryId: profitSetting.categoryId,
                                categoryName: profitSetting.categoryName,
                                percentProfit: profitSetting.percentProfit,
                                moneyProfit: profitSetting.moneyProfit,
                                templateProfit: profitSetting.templateProfit,
                                description: profitSetting.description,
                                currency: profitSetting.currency
                            }
                        ];

                        this.form.setControl('productProfitSetting', this.getSettingAsFormArray(settings));

                        this.productProfitSettingDataSource.data = this.productProfitSettings.controls;

                        this.form.get('templateTransporterCost')?.setValue(res[0].settings.templateTransporterCost.code);
                    }
                },
                error: err => {
                    if (err === "Not Found") {
                        // create new setting
                        let settings: any[] = [
                            {
                                productId: product.id,
                                productName: product.name,
                                categoryId: product.categoryId,
                                categoryName: product.category,
                                percentProfit: null,
                                moneyProfit: null,
                                templateProfit: null,
                                description: null,
                                currency: 'VND'
                            }
                        ];

                        this.form.setControl('productProfitSetting', this.getNewSettingAsFormArray(settings));
                        this.productProfitSettingDataSource.data = this.productProfitSettings.controls;
                    }
                }
            });

        // template profit list
        this.templateService.getTemplates({ type: 1 }, 0, 1000).subscribe((data: any) => {
            if (data) {
                this.templateProfits = data;
                this.templateProfits.forEach((c: any) => {
                    c.settings = JSON.parse(c.settings);
                });
            }
        });

        // template transporter cost setting
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
        console.log(this.productSetting);

        // update
        if (this.productSetting) {
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
                id: this.productSetting.settings.templateProductProfit.id,
                type: this.productSetting.settings.templateProductProfit.type,
                name: this.productSetting.settings.templateProductProfit.name,
                code: this.productSetting.settings.templateProductProfit.code,
                description: this.productSetting.settings.templateProductProfit.description,
                settings: {
                    profits: categoryProfitSettings
                }
            };

            console.log("templateProductProfit", templateProductProfit);

            this.templateService.createTeamplates([templateProductProfit]).subscribe((c: any) => {
                console.log('created template product profit', c);

                if (c) {
                    if (typeof (c[0].settings) == 'string')
                        c[0].settings = JSON.parse(c[0].settings);

                    this.updateProductPriceSetting(c[0]);
                }
            });

        } else {
            // create new
            let code = this.configService.createCode(10);
            let profitSettings = this.productProfitSettings.value.
                filter((s: any) => s.percentProfit || s.moneyProfit || s.templateProfit);

            for (let i = 0; i < profitSettings.length; ++i) {
                if (profitSettings[i].templateProfit) {
                    let templateProfitId = profitSettings[i].templateProfit;
                    profitSettings[i].templateProfit = this.templateProfits.find(c => c.id === templateProfitId);
                }
            }

            // tạo template lợi nhuận theo danh mục sản phẩm này trước rồi gắn vào shop
            let templateProductProfit = {
                type: 4, // templateProductProfit
                name: `Template product profit_${code}`,
                code: `TPP_${code}`,
                description: `Template TPP_${code} set profit of product ${this.product.id}`,
                settings: {
                    profits: profitSettings
                }
            };

            console.log(templateProductProfit);

            this.templateService.createTeamplates([templateProductProfit]).subscribe((c: any) => {
                console.log('update template product profit', c);

                if (c) {
                    if (typeof (c[0].settings) == 'string')
                        c[0].settings = JSON.parse(c[0].settings);

                    this.createProductPriceSetting(c[0]);
                }
            });
        }

        this.dialogRef.close()
    }

    createProductPriceSetting(templateProductProfit: any) {
        let templateTransporterCost = this.templateTransporterCosts.find((c: any) => c.code == this.form.get('templateTransporterCost')?.value);
        if (typeof (templateTransporterCost.settings) == "string") {
            templateTransporterCost.settings = JSON.parse(templateTransporterCost.settings);
        }

        let data = {
            type: 1, // templateProductPrice
            productId: this.product.id,
            description: this.form.get("description")?.value,
            settings: {
                templateProductProfit: templateProductProfit,
                templateTransporterCost: templateTransporterCost
            }
        };

        console.log("create product settings", data);

        this.templateService.createProductSettings([data])
            .subscribe(() => {
                this.updateSalePriceBySettings(this.product.shopId, this.product.id);
                this.alertService.showToastSuccess();
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    updateProductPriceSetting(templateProductProfit: any) {
        let templateTransporterCost = this.templateTransporterCosts.find((c: any) => c.code == this.form.get('templateTransporterCost')?.value);
        if (typeof (templateTransporterCost.settings) == "string") {
            templateTransporterCost.settings = JSON.parse(templateTransporterCost.settings);
        }

        let data = {
            id: this.productSetting.id,
            type: 1, // templateProductPrice
            productId: this.product.id,
            description: this.form.get("description")?.value,
            settings: {
                templateProductProfit: templateProductProfit,
                templateTransporterCost: templateTransporterCost
            }
        };

        console.log("update product settings", data);

        this.templateService.createProductSettings([data])
            .subscribe(() => {
                this.updateSalePriceBySettings(this.product.shopId, this.product.id);
                this.alertService.showToastSuccess();
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

    close() {
        this.dialogRef.close();
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

    updateSalePriceBySettings(shopId: any, productId: any) {
        let data: any = {
            ShopIds: [shopId],
            ProductIds: [productId]
        };

        this.templateService.updateSalePrices(data)
            .subscribe((totalUpdated: any) => {
                console.log(totalUpdated);
                
                if (totalUpdated > 0) {
                    this.alertService.showToastMessage(`Đã cập nhật giá cho sản phẩm`);
                }
                else if (totalUpdated == 0) {
                    this.alertService.showToastMessage(`Không có áp dụng cài đặt cập nhật giá cho sản phẩm`);
                }
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }
}