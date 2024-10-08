import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${environment.apiUrl}/ecommerce/web/posts`;

@Injectable({
    providedIn: 'root'
})
export class PostService extends BaseService {

    constructor(private http: HttpClient) {
        super();
    }

    getPosts(queryParams: any, page: number, size: number, sort: any = { id: 'asc'} ): Observable<any> {
        return this.http.get<any>(apiUrl, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => {}),
                catchError(this.handleError)
            );
    }

    getPostCount(queryParams: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getPost(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/${id}`)
            .pipe(
                tap((dto: any) => {}),
                catchError(this.handleError)
            );
    }

    createPost(data: any) {
        return this.http.post<any>(`${apiUrl}`, data).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    updatePost(id: any, data: any) {
        return this.http.put<any>(`${apiUrl}/${id}`, data).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    active(id: any) {
        return this.http.put<any>(`${apiUrl}/${id}/active`, {}).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    disable(id: any) {
        return this.http.put<any>(`${apiUrl}/${id}/disable`, {}).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    approved(id: any) {
        return this.http.post<any>(`${apiUrl}/${id}/approve`, {}).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    decline(id: any) {
        return this.http.post<any>(`${apiUrl}/${id}/decline`, {}).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }


    getQueryParams(queryParams: any, page: number = 0, size: number = 10, sort: any = {}){
        let formObject: any = {};
        if (queryParams.id) formObject.id = queryParams.id;
        if (queryParams.textId) formObject.textId = queryParams.textId;
        if (queryParams.shopId) formObject.shopId = queryParams.shopId;
        if (queryParams.productId) formObject.productId = queryParams.productId;
        if (queryParams.parentId) formObject.parentId = queryParams.parentId;
        if (queryParams.content) formObject.content = queryParams.content;
        if (queryParams.createdBy) formObject.createdBy = queryParams.createdBy;
        if (queryParams.type) formObject.type = queryParams?.type;
        if (queryParams.createdDateFrom) formObject.createdDateFrom = queryParams?.createdDateFrom;
        if (queryParams.createdDateTo) formObject.createdDateTo = queryParams?.createdDateTo;
        if (queryParams.active) formObject.active = queryParams?.active;
        if (queryParams.approve) formObject.approve = queryParams?.approve;
        if (queryParams.autoApprove) formObject.autoApprove = queryParams?.autoApprove;
        if (page) { formObject.page = page } else formObject.page = 0;
        if (size) { formObject.size = size } else formObject.size = 10;
        if (sort) { formObject.sort = sort }

        return new HttpParams({
            fromObject: formObject
        });
    }
}