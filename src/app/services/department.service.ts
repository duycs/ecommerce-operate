import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${environment.apiUrl}/ecommerce/web/departments`;

@Injectable({
    providedIn: 'root'
})
export class DepartmentService extends BaseService {

    constructor(private http: HttpClient) {
        super();
    }

    getDepartments(queryParams: any, page: number, size: number, sort: any = { id: 'asc'} ): Observable<any> {
        return this.http.get<any>(apiUrl, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => {}),
                catchError(this.handleError)
            );
    }

    getDepartmentCount(queryParams: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getDepartment(id: any): Observable<any> {
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

    setInactive(id: any) {
        return this.http.put<any>(`${apiUrl}/${id}/inactive`, {}).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    updateDepartment(id: any, data: any) {
        return this.http.put<any>(`${apiUrl}/${id}`, data).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    createDepartment(data: any) {
        return this.http.post<any>(`${apiUrl}`, data).pipe(
            tap((dto: any) => console.log(`Created: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    getPrints(queryParams: any, page: number, size: number, sort: any = { id: 'asc'} ): Observable<any> {
        return this.http.get<any>(`${apiUrl}/printers`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => {}),
                catchError(this.handleError)
            );
    }

    getPrintCount(queryParams: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/printers/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getPrint(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/printers/${id}`)
            .pipe(
                tap((dto: any) => {}),
                catchError(this.handleError)
            );
    }

    getQueryParams(queryParams: any, page: number = 0, size: number = 10, sort: any = {}){
        let formObject: any = {};
        if (queryParams.id) formObject.id = queryParams.id;
        if (queryParams.name) formObject.name = queryParams.name;
        if (queryParams.description) formObject.description = queryParams.description;
        if (queryParams.active) formObject.active = queryParams.active;
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