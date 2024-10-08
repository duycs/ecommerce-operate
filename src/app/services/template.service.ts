import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../shared/config.service';
import { ProductService } from './product.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${environment.apiUrl}/ecommerce/web/templates`;

@Injectable({
    providedIn: 'root'
})
export class TemplateService extends BaseService {

    constructor(private http: HttpClient,
        private configService: ConfigService,
        private productservice: ProductService) {
        super();
    }

    shopProductPriceSetting: any = {
        id: 1,
        name: 'Shop 1',
        templateProductProfit: {
            id: 1,
            name: 'TP1',
            code: 'TP1',
            description: "mô tả...",
            createdDate: new Date(),
            createdBy: 'pexnic',
            settings: {
                categoryProfits: [
                    {
                        categoryName: 'Giày',
                        percentProfit: 10,
                        moneyProfit: null,
                        templateProfit: null,
                        currency: 'VND',
                        description: 'mô tả...'
                    },
                    {
                        categoryName: 'Dép',
                        percentProfit: null,
                        moneyProfit: 100,
                        templateProfit: null,
                        currency: 'VND',
                        description: 'mô tả...'
                    },
                    {
                        categoryName: 'Áo',
                        percentProfit: null,
                        moneyProfit: null,
                        currency: 'VND',
                        templateProfit: {
                            id: 1,
                            type: "1",
                            name: "C1",
                            code: "C1",
                            description: "mô tả...",
                            createdDate: new Date(),
                            createdBy: 'pexnic',
                            settings: {
                                profitType: { id: "1", name: "%" },
                                profitRanges: [
                                    { fromPrice: null, toPrice: 200000, profit: 10, currency: 'VND' },
                                    { fromPrice: 200000, toPrice: 500000, profit: 7, currency: 'VND' },
                                    { fromPrice: 500000, toPrice: 100000, profit: 5, currency: 'VND' },
                                ]
                            },
                        },
                        description: 'mô tả...'
                    }
                ]
            }
        },
        templateTransporterCost: {
            id: "1",
            name: "C1",
            code: "C1",
            description: "mô tả...",
            createdDate: new Date(),
            createdBy: 'pexnic',
            settings: {
                categoryTransporterCosts: [
                    {
                        id: 1,
                        categoryId: "1",
                        categoryName: "Bata nam",
                        cost: 10000,
                        currency: 'VND',
                        description: ""
                    }
                ]
            }
        }
    };


    templateProfit: any = {
        id: 1,
        type: 1,
        name: "C1",
        code: "TL1_C1",
        description: "Template lợi nhuận TL1_C1",
        createdDate: new Date(),
        createdBy: 'pexnic',
        settings: {
            profitType: { id: 1, name: "%" },
            profitRanges: [
                { fromPrice: null, toPrice: null, profit: null, currency: 'VND' },
            ]
        },
    };

    templateCategoryTransporterCost: any = {
        id: "1",
        type: "2",
        name: "C1",
        code: "C1",
        description: "mô tả...",
        createdDate: new Date(),
        createdBy: 'pexnic',
        settings: {
            categoryCosts: [
                {
                    categoryId: 1,
                    categoryName: "Bata nam",
                    cost: 10000,
                    currency: 'VND',
                    description: "mô tả..."
                },
                {
                    categoryId: 2,
                    categoryName: "Áo thun",
                    cost: 5000,
                    currency: 'VND',
                    description: "mô tả..."
                }
            ]
        }
    };

    mappingProductSetting(c: any) {
        try {
            c.enableStatusChips = this.getEnableStatusChips(c.enable);
        } catch {
            return c;
        }
        return c;
    }

    mappingShopSetting(c: any, categoryCount: number) {
        try {
            c.setup = c.settings ? c.settings.templateProductProfit?.settings?.categoryProfits?.length : 0;
            c.notSetup = categoryCount ?? 0;
            c.setupRatio = c.notSetup > 0 ? (c.setup ?? 0 / (c.notSetup * 100)) : 0;
            c.setupStatusChips = this.getSetupStatusChips(c.setup, c.notSetup);
            c.setupRatioColorClass = c.setupRatio < 100 ? 'progress-orange' : (c.setupRatio == 100 ? 'progress-green' : 'progress-blue');
            c.enableStatusChips = this.getEnableStatusChips(c.enable);
        } catch {
            return c;
        }
        return c;
    }

    getSetupStatusChips(setup: number, notSetup: number) {
        if (!setup) {
            return [{ name: "Chưa thiết lập", color: "orange" }];
        }

        if (setup <= notSetup) {
            return [{ name: "Đã thiết lập", color: "primary" }];
        }

        return [{ name: "Unknown", color: "primary" }];
    }

    getEnableStatusChips(enable: any) {
        if (enable) {
            return [{ name: "Kích hoạt", color: "primary" }];
        } else {
            return [{ name: "Chưa kích hoạt", color: "orange" }];
        }
    }


    getShopProductPriceSettings() {
        let shopProductPriceSettings: any = [
            {
                id: "1",
                code: "1",
                shop: {
                    id: 1,
                    name: "NCC1",
                    code: "NCC1"
                },
                setup: 1,
                notSetup: 2,
                setupRatio: (1 / 2) * 100,
                description: "mô tả...",
                createdBy: 'pexnic',
                createdDate: new Date(),
                setupChips: [{ name: 'đã thiết lập', color: 'primary' }],
                templateProductProfit: {
                    id: 1,
                    name: 'TP1',
                    code: 'TP1',
                    description: "mô tả...",
                    createdDate: new Date(),
                    createdBy: 'pexnic',
                    settings: {
                        categoryProfits: [
                            {
                                categoryId: '1',
                                categoryName: 'Giày',
                                percentProfit: 10,
                                moneyProfit: null,
                                templateProfit: null,
                                currency: 'VND',
                                description: 'mô tả...'
                            },
                            {
                                categoryId: '2',
                                categoryName: 'Dép',
                                percentProfit: null,
                                moneyProfit: 100,
                                templateProfit: null,
                                currency: 'VND',
                                description: 'mô tả...'
                            },
                            {
                                categoryId: '3',
                                categoryName: 'Áo',
                                percentProfit: null,
                                moneyProfit: null,
                                templateProfit: this.templateProfit,
                                currency: 'VND',
                                description: 'mô tả...'
                            }
                        ]
                    }
                },
                templateTransporterCost: this.templateCategoryTransporterCost
            }
        ];

        return shopProductPriceSettings;
    }

    getTemplateProductProfits() {
        return [this.templateProfit];
    }

    getTemplateTransporterCosts() {
        return [this.templateCategoryTransporterCost];
    }

    getTemplateProfuctProfitByShopAsFormArray(shops: any[]) {
        const fgs = shops.map((shop: any) => {
            return new FormGroup({
                id: new FormControl(this.configService.getNewUid()),
                shopId: new FormControl(shop.shopId, Validators.required),
                shopName: new FormControl(shop.shopName, Validators.required),
                percentProfit: new FormControl(null, Validators.required),
                moneyProfit: new FormControl(null, Validators.required),
                currency: new FormControl('VND', Validators.required),
                templateProfit: new FormControl(null, Validators.required),
                description: new FormControl('', Validators.required)
            });
        });

        return new FormArray(fgs);
    }

    getShopProfuctProfitBySettingAsFormArray(settings: any[]) {
        const fgs = settings.map((setting: any) => {
            return new FormGroup({
                id: new FormControl(setting.id),
                shopId: new FormControl(setting.shopId, Validators.required),
                shopName: new FormControl(setting.shopName, Validators.required),
                percentProfit: new FormControl(setting.percentProfit, Validators.required),
                moneyProfit: new FormControl(setting.moneyProfit, Validators.required),
                currency: new FormControl(setting.currency ?? 'VND', Validators.required),
                templateProfit: new FormControl(setting.templateProfit, Validators.required),
                description: new FormControl(setting.description, Validators.required)
            });
        });

        return new FormArray(fgs);
    }

    getTemplateProfuctProfitByCategoryProfitAsFormArray(categoryProfits: any[]) {
        const fgs = categoryProfits.map((categoryProfit: any) => {
            return new FormGroup({
                id: new FormControl(this.configService.getNewUid()),
                categoryId: new FormControl(categoryProfit.categoryId, Validators.required),
                categoryName: new FormControl(categoryProfit.categoryName),
                percentProfit: new FormControl(categoryProfit.percentProfit),
                moneyProfit: new FormControl(categoryProfit.moneyProfit),
                currency: new FormControl(categoryProfit.currency),
                templateProfit: new FormControl(categoryProfit.templateProfit),
                description: new FormControl(categoryProfit.description)
            });
        });

        return new FormArray(fgs);
    }

    getNewTemplateProfuctProfitByCategoryAsFormArray(categories: any[]) {
        const fgs = categories.map((category: any) => {
            return new FormGroup({
                id: new FormControl(this.configService.getNewUid()),
                categoryId: new FormControl(category.id, Validators.required),
                categoryName: new FormControl(category.name),
                percentProfit: new FormControl(null),
                moneyProfit: new FormControl(null),
                currency: new FormControl('VND'),
                templateProfit: new FormControl(null),
                description: new FormControl(null)
            });
        });

        return new FormArray(fgs);
    }

    getTemplateTransporterCostByTemplateAsFormArray(settings: any[]) {
        const fgs = settings.map((setting: any) => {
            return new FormGroup({
                id: new FormControl(setting.id),
                templateId: new FormControl(setting.templateId, Validators.required),
                templateName: new FormControl(setting.templateName, Validators.required),
                cost: new FormControl(setting.cost ?? 0, Validators.required),
                currency: new FormControl(setting.currency ?? 'VND', Validators.required),
                description: new FormControl(setting.description ?? '')
            });
        });

        return new FormArray(fgs);
    }

    getNewTemplateTransporterCostByTemplateAsFormArray(templates: any[], cost: any = null) {
        const fgs = templates.map((template: any) => {
            return new FormGroup({
                id: new FormControl(this.configService.getNewUid()),
                templateId: new FormControl(template.id, Validators.required),
                templateName: new FormControl(template.name, Validators.required),
                cost: new FormControl(cost),
                currency: new FormControl('VND', Validators.required),
                description: new FormControl('')
            });
        });

        return new FormArray(fgs);
    }

    getNewTemplateTransporterCostByCategoryAsFormArray(categories: any[], cost: any = null) {
        const fgs = categories.map((category: any) => {
            return new FormGroup({
                id: new FormControl(this.configService.getNewUid()),
                categoryId: new FormControl(category.id, Validators.required),
                categoryName: new FormControl(category.name, Validators.required),
                cost: new FormControl(cost, Validators.required),
                currency: new FormControl('VND', Validators.required),
                description: new FormControl('')
            });
        });

        return new FormArray(fgs);
    }

    getTemplateTransporterCostAsFormArray(categoryCosts: any[], cost: any = null) {
        const fgs = categoryCosts.map((categoryCost: any) => {
            return new FormGroup({
                id: new FormControl(this.configService.getNewUid()),
                categoryId: new FormControl(categoryCost.categoryId, Validators.required),
                categoryName: new FormControl(categoryCost.categoryName, Validators.required),
                cost: new FormControl(categoryCost?.cost ?? null, Validators.required),
                currency: new FormControl(categoryCost.currency ?? 'VND', Validators.required),
                description: new FormControl(categoryCost.description)
            });
        });

        return new FormArray(fgs);
    }

    getNewTemplateProductProfitAsFormArray(): FormArray {
        const fgs = this.templateProfit.settings.profitRanges.map((setting: any) => {
            return new FormGroup({
                id: new FormControl(this.configService.getNewUid()),
                fromPrice: new FormControl(setting.fromPrice, Validators.required),
                toPrice: new FormControl(setting.toPrice, Validators.required),
                currency: new FormControl(setting.currency, Validators.required),
                profit: new FormControl(null)
            })
        });

        return new FormArray(fgs);
    }

    getTemplateProductProfitAsFormArray(settings: any): FormArray {
        const fgs = settings.profitRanges.map((setting: any) => {
            return new FormGroup({
                id: new FormControl(this.configService.getNewUid()),
                fromPrice: new FormControl(setting.fromPrice, Validators.required),
                toPrice: new FormControl(setting.toPrice, Validators.required),
                currency: new FormControl(setting.currency, Validators.required),
                profit: new FormControl(setting.profit, Validators.required),
            })
        });

        return new FormArray(fgs);
    }

    createProductSettings(data: any[]): Observable<any> {
        return this.http.post<any>(`${apiUrl}/product-settings`, data).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    getProductSettings(queryParams: any = {}, page: any = 0, size: any = 10, sort: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/product-settings`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getCountProductSettings(queryParams: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/product-settings/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getProductSetting(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/product-settings/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }


    createShopSettings(data: any[]): Observable<any> {
        return this.http.post<any>(`${apiUrl}/shop-settings`, data).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    getShopSettings(queryParams: any = {}, page: any = 0, size: any = 10, sort: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/shop-settings`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getCountShopSettings(queryParams: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/shop-settings/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getShopSetting(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/shop-settings/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getShopWithSettings(queryParams: any = {}, page: any = 0, size: any = 10, sort: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/shop-with-settings`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getCountShopWithSettings(queryParams: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/shop-with-settings/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    // create or update tempate
    createTeamplates(data: any[]): Observable<any> {
        return this.http.post<any>(`${apiUrl}`, data).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    getTemplates(queryParams: any = {}, page: any = 0, size: any = 10, sort: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getCountTemplates(queryParams: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getTemplate(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    removeTemplate(id: any): Observable<any> {
        return this.http.delete<any>(`${apiUrl}/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    removeShopSetting(id: any): Observable<any> {
        return this.http.delete<any>(`${apiUrl}/shop-settings/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    enableShopSetting(id: any): Observable<any> {
        return this.http.put<any>(`${apiUrl}/shop-settings/${id}/enable`, {})
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    diableShopSetting(id: any): Observable<any> {
        return this.http.put<any>(`${apiUrl}/shop-settings/${id}/disable`, {})
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    enableProductSetting(id: any): Observable<any> {
        return this.http.put<any>(`${apiUrl}/product-settings/${id}/enable`, {})
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    diableProductSetting(id: any): Observable<any> {
        return this.http.put<any>(`${apiUrl}/product-settings/${id}/disable`, {})
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    removeProductSetting(id: any): Observable<any> {
        return this.http.delete<any>(`${apiUrl}/product-settings/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    enableTemplate(id: any): Observable<any> {
        return this.http.put<any>(`${apiUrl}/${id}/enable`, {})
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    diableTemplate(id: any): Observable<any> {
        return this.http.put<any>(`${apiUrl}/${id}/disable`, {})
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    updateSalePrices(data: any): Observable<any> {
        return this.http.post<any>(`${apiUrl}/shop-settings/update-sale-prices`, data)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getQueryParams(queryParams: any, page: number = 0, size: number = 10, sort: any = {}) {
        let formObject: any = {};
        if (queryParams.id) formObject.id = queryParams.id;
        if (queryParams.type) formObject.type = queryParams.type;
        if (queryParams.name) formObject.name = queryParams.name;
        if (queryParams.code) formObject.code = queryParams.code;
        if (queryParams.shopId) formObject.shopIds = [queryParams.shopId];
        if (queryParams.productIds) formObject.productIds = [queryParams.productIds];
        if (queryParams.shopName) formObject.shopName = queryParams.shopName;
        if (queryParams.categoryId) formObject.categoryId = queryParams.categoryId;
        if (queryParams.description) formObject.description = queryParams.description;
        if (queryParams.productSku) formObject.productSku = [queryParams.productSku];
        if (queryParams.enable) formObject.enable = queryParams.enable;
        if (queryParams.createdDateFrom) formObject.createdDateFrom = queryParams?.createdDateFrom;
        if (queryParams.createdDateTo) formObject.createdDateTo = queryParams?.createdDateTo;
        if (queryParams.lastUpdatedDateFrom) formObject.lastUpdatedDateFrom = queryParams?.lastUpdatedDateFrom;
        if (queryParams.lastUpdatedDateTo) formObject.lastUpdatedDateTo = queryParams?.lastUpdatedDateTo;
        if (page) { formObject.page = page } else formObject.page = 0;
        if (size) { formObject.size = size } else formObject.size = 10;
        if (sort) { formObject.sort = sort }

        return new HttpParams({
            fromObject: formObject
        });
    }
}