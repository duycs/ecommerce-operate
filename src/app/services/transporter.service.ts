import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${environment.apiUrl}/ecommerce/web/transporters`;

@Injectable({
    providedIn: 'root'
})
export class TransporterService extends BaseService {

    constructor(private http: HttpClient) {
        super();
    }

    getTransporters(queryParams: any, page: number, size: number, sort: any = { id: 'asc'} ): Observable<any> {
        return this.http.get<any>(apiUrl, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => {}),
                catchError(this.handleError)
            );
    }

    getTransporterCount(queryParams: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getTransporter(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/${id}`)
            .pipe(
                tap((dto: any) => {}),
                catchError(this.handleError)
            );
    }

    setActive(id: any) {
        return this.http.put<any>(`${apiUrl}/${id}/active`, {}).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    setDisable(id: any) {
        return this.http.put<any>(`${apiUrl}/${id}/disable`, {}).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    createOrUpdateTransporter(data: any) {
        return this.http.post<any>(`${apiUrl}`, data).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    getTransporterShops(id: any, queryParams: any, page: number, size: number, sort: any = { id: 'asc'} ): Observable<any> {
        return this.http.get<any>(`${apiUrl}/${id}/shops`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => {}),
                catchError(this.handleError)
            );
    }

    getTransporterShopCount(id: any, queryParams: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/${id}/shops/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getTransporterProducts(id: any, queryParams: any, page: number, size: number, sort: any = { id: 'asc'} ): Observable<any> {
        return this.http.get<any>(`${apiUrl}/${id}/products`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => {}),
                catchError(this.handleError)
            );
    }

    getTransporterProductCount(id: any, queryParams: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/${id}/products/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getQueryParams(queryParams: any, page: number = 0, size: number = 10, sort: any = {}){
        let formObject: any = {};
        if (queryParams.id) formObject.id = queryParams.id;
        if (queryParams.name) formObject.name = queryParams.name;
        if (queryParams.code) formObject.code = queryParams.code;
        if (queryParams.status) formObject.status = queryParams.status;
        if (queryParams.shopId) formObject.shopId = queryParams.shopId;
        if (queryParams.categoryId) formObject.categoryId = queryParams.categoryId;
        if (queryParams.productId) formObject.productId = queryParams.productId;
        if (queryParams.productName) formObject.productName = queryParams.productName;
        if (queryParams.productSku) formObject.productSku = queryParams.productSku;
        if (queryParams.brandId) formObject.brandId = queryParams.brandId;
        if (queryParams.phoneNumber) formObject.phoneNumber = queryParams.phoneNumber;
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