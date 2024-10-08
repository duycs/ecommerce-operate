import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AlertService } from './alert.service';
import { BaseService } from '../shared/base.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${environment.apiUrl}/ecommerce/file`;
const sizeDefault = 10;

@Injectable({
    providedIn: 'root'
})
export class PhotoService extends BaseService {
    constructor(private http: HttpClient,
        private alertService: AlertService,
    ) {
        super();
    }

    getPhotos(uploadType: number, page: number = 1, size: number = sizeDefault, searchValue: string = '', isInclude: boolean = true)
        : Observable<any> {

        let params: any = {
            pageNumber: page,
            pageSize: size,
            isInclude: isInclude,
            searchValue: searchValue,
            uploadType: uploadType
        };

        console.log("params", params);

        return this.http.get<any>(`${apiUrl}/photos`, { params: params })
            .pipe(
                tap(() => console.log('Fetched')),
                catchError(this.handleError)
            );
    }

    uploadPhoto(formData: any, options: any): Observable<any> {
        console.log(formData);

        return this.http.post<any>(`${apiUrl}/image/upload2`, formData, options).pipe(
            tap((data: any) => {
            }),
            catchError(this.handleError)
        );
    }

    removePhotos(fileUrls: any[]): Observable<any> {
        return this.http.get<any>(`${apiUrl}/remove?fileUrls=${fileUrls}`).pipe(
            tap((modelName: any) => console.log(`Deleted: ${JSON.stringify(modelName)}`)),
            catchError(this.handleError)
        );
    }

    downloadPhotos(fileUrls: any[], isZip = false): Observable<any> {
        return this.http.get(`${apiUrl}/download?fileUrls=${fileUrls}&isZip=${isZip}`, {
            reportProgress: true,
            responseType: 'blob',
        });
    }

    savePhoto(savePhoto: any): Observable<any> {
        console.log(savePhoto);
        return this.http.post<any>(apiUrl, savePhoto, httpOptions).pipe(
            tap((modelName: any) => console.log(`Added: ${JSON.stringify(modelName)}`)),
            catchError(this.handleError)
        );
    }

    getPhoto(id: number): Observable<any> {
        const url = `${apiUrl}/${id}`;
        return this.http.get<any>(url, httpOptions).pipe(
            tap(_ => console.log('Fetched')),
            catchError(this.handleError)
        );
    }
}