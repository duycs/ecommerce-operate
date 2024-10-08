import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${environment.apiUrl}/notification`;

@Injectable({
    providedIn: 'root'
})
export class NotificationService extends BaseService {

    constructor(private http: HttpClient) {
        super();
    }

    getNotifications(queryParams: any, page: number, size: number): Observable<any> {
        return this.http.get<any>(`${apiUrl}/web/mine`,  { params: this.getQueryParams(queryParams, page, size) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getUnreadCount(): Observable<any> {
        return this.http.get<any>(`${apiUrl}/web/mine/unRead`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    seen(id: any): Observable<any> {
        return this.http.post<any>(`${apiUrl}/web/mine/${id}/seen`, {})
            .pipe(
                tap((dto: any) => { console.log("seen") }),
                catchError(this.handleError)
            );
    }

    seenAll(id: any): Observable<any> {
        return this.http.post<any>(`${apiUrl}/web/mine/seenAll`, {})
            .pipe(
                tap((dto: any) => { console.log("seenAll") }),
                catchError(this.handleError)
            );
    }

    sendNotification(data: any): Observable<any> {
        return this.http.post<any>(`${apiUrl}/web/notification`, data)
            .pipe(
                tap((dto: any) => { console.log("send") }),
                catchError(this.handleError)
            );
    }

    
    getQueryParams(queryParams: any, page: number = 0, size: number = 20, sort: any = {}) {
        let formObject: any = {};
        if (queryParams?.id) formObject.id = queryParams?.id;
        if (queryParams?.status) formObject.status = queryParams.status;
        if (page) { formObject.page = page } else formObject.page = 0;
        if (size) { formObject.size = size } else formObject.size = 20;
        if (sort) { formObject.sort = sort }

        return new HttpParams({
            fromObject: formObject
        });
    }
}