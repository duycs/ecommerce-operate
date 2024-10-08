import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${environment.apiUrl}/ecommerce/web/brands`;

@Injectable({
    providedIn: 'root'
})
export class BrandService extends BaseService {

    constructor(private http: HttpClient) {
        super();
    }

    getBrands(queryParams: any, page: any = 1, size: any = 10): Observable<any> {
        return this.http.get<any>(`${apiUrl}`, { params: this.getQueryParams(queryParams, page, size) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getQueryParams(queryParams: any, page: number = 0, size: number = 10, sort: any = {}) {
        let formObject: any = {};
        if (queryParams?.id) formObject.id = queryParams?.id;
        if (queryParams?.name) formObject.name = queryParams?.name;
        if (queryParams?.code) formObject.code = queryParams?.code;
        if (page) { formObject.page = page } else formObject.page = 0;
        if (size) { formObject.size = size } else formObject.size = 10;
        if (sort) { formObject.sort = sort }

        return new HttpParams({
            fromObject: formObject
        });
    }
}