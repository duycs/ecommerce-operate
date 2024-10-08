import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { ProductDetailDto } from '../shared/models/product/productDetailDto';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${environment.apiUrl}/ecommerce/web/product`;

@Injectable({
    providedIn: 'root'
})
export class ProductService extends BaseService {

    constructor(private http: HttpClient) {
        super();
    }

    createProductCategory(data: any) {
        return this.http.post<any>(`${apiUrl}/categories`, data).pipe(
            tap((dto: any) => console.log(`Created: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    updateProductCategory(id: any, data: any) {
        return this.http.put<any>(`${apiUrl}/categories/${id}`, data).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    activeProductCategory(categoryId: any) {
        return this.http.put<any>(`${apiUrl}/categories/${categoryId}/active`, {}).pipe(
            tap((dto: any) => console.log(`Created: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    inactiveProductCategory(categoryId: any) {
        return this.http.put<any>(`${apiUrl}/categories/${categoryId}/inactive`, {}).pipe(
            tap((dto: any) => console.log(`Created: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    getProductCategories(queryParams: any = {}, page: any = 0, size: any = 10, sort: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/categories`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getProductCategory(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/categories/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getProductInOrders(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        return this.http.get<any>(`${apiUrl}/in-order`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getProductInOrderCount(queryParams: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/in-order/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getProducts(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        return this.http.get<any>(apiUrl, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getProductEnters(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        return this.http.get<any>(`${apiUrl}/enters`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getProductOrders(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        return this.http.get<any>(`${apiUrl}/orders`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getProduct(id: any): Observable<ProductDetailDto> {
        return this.http.get<any>(`${apiUrl}/${id}`)
            .pipe(
                tap((dto: ProductDetailDto) => { }),
                catchError(this.handleError)
            );
    }

    getCount(queryParams: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    createProduct(createProduct: any) {
        return this.http.post<any>(apiUrl, createProduct).pipe(
            tap((dto: any) => console.log(`Created: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    updateProduct(updateProduct: any) {
        return this.http.put<any>(apiUrl, updateProduct).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    updateProductStatus(updateProductStatusVM: any) {
        return this.http.put<any>(`${apiUrl}/status`, updateProductStatusVM).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    deleteProduct(id: any) {
        return this.http.delete<any>(`${apiUrl}/${id}`).pipe(
            tap(() => console.log(`Deleted`)),
            catchError(this.handleError)
        );
    }

    activeProduct(id: any) {
        return this.http.post<any>(`${apiUrl}/${id}/active`, "").pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    disableProduct(id: any) {
        return this.http.post<any>(`${apiUrl}/${id}/disable`, "").pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    createProductPriceSettings(data: any) {
        return this.http.post<any>(`${apiUrl}/price-settings`, data).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    getProductPriceSettings(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        return this.http.get<any>(`${apiUrl}/price-settings`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getCountProductPriceSettings(queryParams: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/price-settings/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getProductGroups(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        return this.http.get<any>(`${apiUrl}/groups`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getCountProductGroups(queryParams: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/groups/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getProductGroup(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/groups/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    createProductGroup(data: any) {
        return this.http.post<any>(`${apiUrl}/groups`, data).pipe(
            tap((dto: any) => console.log(`Created: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    updateProductGroup(id: any, data: any) {
        return this.http.put<any>(`${apiUrl}/groups${id}`, data).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    removeProductGroup(id: any) {
        return this.http.delete<any>(`${apiUrl}/groups/${id}`).pipe(
            tap((dto: any) => console.log(`Deleted: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    visibleProductGroup(id: any) {
        return this.http.put<any>(`${apiUrl}/groups/${id}/visible`, "").pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    invisibleProductGroup(id: any) {
        return this.http.put<any>(`${apiUrl}/groups/${id}/invisible`, "").pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    getQueryParams(queryParams: any, page: number = 0, size: number = 10, sort: any = {}) {
        let formObject: any = {};
        if (queryParams.id) formObject.id = queryParams.id;
        if (queryParams.sku) formObject.sku = queryParams.sku;
        if (queryParams.shopId) formObject.shopId = queryParams.shopId
        if (queryParams.categoryId) formObject.categoryId = queryParams.categoryId;
        if (queryParams.productId) formObject.productId = queryParams.productId;
        if (queryParams.brandId) formObject.brandId = queryParams.brandId;
        if (queryParams.name) formObject.name = queryParams.name;
        if (queryParams.active) formObject.active = queryParams.active;
        if (queryParams.isActive) formObject.isActive = queryParams.isActive;
        if (queryParams.approve) formObject.approve = queryParams.approve;
        if (queryParams.autoApprove) formObject.autoApprove = queryParams?.autoApprove;
        if (queryParams.note) formObject.note = queryParams.note;
        if (queryParams.price) formObject.price = queryParams.price;
        if (queryParams.code) formObject.code = queryParams.code;
        if (queryParams.createdDateFrom) formObject.createdDateFrom = queryParams?.createdDateFrom;
        if (queryParams.createdDateTo) formObject.createdDateTo = queryParams?.createdDateTo;
        if (page) { formObject.page = page } else formObject.page = 0;
        if (size) { formObject.size = size } else formObject.size = 10;
        if (sort) { formObject.sort = sort }

        return new HttpParams({
            fromObject: formObject
        });
    }
}