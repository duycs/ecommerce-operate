import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${environment.apiUrl}/ecommerce/web/customers`;

@Injectable({
    providedIn: 'root'
})
export class CustomerService extends BaseService {

    constructor(private http: HttpClient) {
        super();
    }

    getCustomers(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        let params = this.getQueryParams(queryParams, page, size, sort);

        return this.http.get<any>(apiUrl, { params: params })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getCustomer(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    activeCustomer(id: any) {
        return this.http.put<any>(`${apiUrl}/${id}/active`, {}).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    disableCustomer(id: any) {
        return this.http.put<any>(`${apiUrl}/${id}/disable`, {}).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    getCustomerDebts(id: any, queryParams: any, page: number, size: number, sortDirection: any = {}) {
        let params = this.getQueryParams(queryParams, page, size, sortDirection);
        return this.http.get<any>(`${apiUrl}/${id}/debt`, { params: params })
            .pipe(
                tap((dto: any) => {}),
                catchError(this.handleError)
            );
    }

    getCustomerDebtCount(id: any, queryParams: any) {
        let params = this.getQueryParams(queryParams);
        return this.http.get<any>(`${apiUrl}/${id}/debt/count`, { params: params })
            .pipe(
                tap((dto: any) => {}),
                catchError(this.handleError)
            );
    }

    addCustomerDebt(data: any, id: any) {
        return this.http.post<any>(`${apiUrl}/${id}/debt`, data).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    getCustomerDebtConfigs(queryParams: any, page: number, size: number, sortDirection: any = {}) {
        let params = this.getQueryParams(queryParams, page, size, sortDirection);
        return this.http.get<any>(`${apiUrl}/debt-limits`, { params: params })
            .pipe(
                tap((dto: any) => {}),
                catchError(this.handleError)
            );
    }

    getCustomerDebtConfigCount(queryParams: any) {
        let params = this.getQueryParams(queryParams);
        return this.http.get<any>(`${apiUrl}/debt-limits/count`, { params: params })
            .pipe(
                tap((dto: any) => {}),
                catchError(this.handleError)
            );
    }

    createCustomerDebtLimits(data: any) {
        return this.http.post<any>(`${apiUrl}/debt-limits`, data).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }


    getQueryParams(queryParams: any, page: number = 0, size: number = 10, sort: any = {}) {
        let formObject: any = {};
        if (queryParams.id) formObject.id = queryParams.id;
        if (queryParams.name) formObject.name = queryParams.name;
        if (queryParams.phoneNumber) formObject.phoneNumber = queryParams.phoneNumber;
        if (queryParams.extraPhoneNumbers) formObject.extraPhoneNumbers = queryParams.extraPhoneNumbers;
        if (queryParams.email) formObject.email = queryParams?.email;
        if (queryParams.gender) formObject.gender = queryParams?.gender;
        if (queryParams.isActive) formObject.isActive = queryParams?.isActive;
        if (queryParams.note) formObject.note = queryParams?.note;
        if (queryParams.createdBy) formObject.createdBy = queryParams?.createdBy;
        if (queryParams.customerId) formObject.customerId = queryParams?.customerId;
        if (queryParams.createdDateFrom) formObject.createdDateFrom = queryParams?.createdDateFrom;
        if (queryParams.createdDateTo) formObject.createdDateTo = queryParams?.createdDateTo;
        if (queryParams.debtAmountType) formObject.debtAmountType = queryParams?.debtAmountType;
        if (queryParams.description) formObject.description = queryParams?.description;
        if (page) { formObject.page = page } else formObject.page = 0;
        if (size) { formObject.size = size } else formObject.size = 10;
        if (sort) { formObject.sort = sort }

        return new HttpParams({
            fromObject: formObject
        });
    }
}