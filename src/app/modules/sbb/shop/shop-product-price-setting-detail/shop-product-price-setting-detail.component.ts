import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from 'src/app/shared/config.service';
import { TemplateService } from 'src/app/services/template.service';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-shop-product-price-setting-detail',
    templateUrl: './shop-product-price-setting-detail.component.html',
})

export class ShopProductPriceSettingDetailComponent implements OnInit, AfterViewInit {
    id!: any;
    category: any = [];
    name!: string;
    code!: string;
    data!: any;
    productProfitTemplates!: any[];
    transporterCostTemplates!: any[];
    selectedProfuctProfitTemplates!: any[];
    selectedTransporterCostTemplates!: any[];
    suggestCode: string = '';
    suggestName: string = '';
    settingDataSource = new MatTableDataSource<any>([]);
    displayedColumns = ['numbericalOrder', 'category', 'profit', 'moneyProfit', 'templateProfit', 'description']

    constructor(
        private configService: ConfigService,
        private productService: ProductService,
        private alertService: AlertService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private templateService: TemplateService,
    ) { }

    ngAfterViewInit(): void {
    }


    ngOnInit(): void {
        this.id = this.activeRoute.snapshot.params['id'];
        this.productService.getProductCategories({}, 0, 1000).subscribe((res: any) => {
            if (res && res.data && res.data.length > 0) {
                this.templateService.getShopSetting(this.id).subscribe((data: any) => {
                    
                    if (data) {
                        this.data = data;
                        this.data.settings = JSON.parse(this.data.settings);
                        this.data = this.templateService.mappingShopSetting(this.data, res.totalRecords);
                        this.settingDataSource.data = this.data.settings.templateProductProfit.settings.categoryProfits;
                    }
                });
            }
        });



        //this.initSettingsByCategory();
    }

    initSettingsByCategory() {
        this.productService.getProductCategories({}, 0, 1000).subscribe((res: any) => {
            if (res && res.data && res.data.length > 0) {
                this.settingDataSource.data = this.templateService.getNewTemplateProfuctProfitByCategoryAsFormArray(res.data).value;
            }
        });


        this.productProfitTemplates = this.templateService.getTemplateProductProfits();
        this.transporterCostTemplates = this.templateService.getTemplateTransporterCosts();
    }

    update() {
        this.router.navigateByUrl(`/sbb/shop-product-price-settings/${this.id}/update`);
    }

    remove() {
        this.templateService.removeShopSetting(this.id)
            .subscribe(() => {
                this.alertService.showToastSuccess();
                this.router.navigateByUrl('/sbb/shop-product-price-settings');
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }
}