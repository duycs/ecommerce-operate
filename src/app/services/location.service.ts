import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AlertService } from './alert.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${environment.apiUrl}/ecommerce/location`;
const sizeDefault = 10;

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    constructor(private http: HttpClient,
        private alertService: AlertService,
    ) { }

    getLocations(): Observable<any> {
        return this.http.get<any>(`${apiUrl}`)
            .pipe(
                tap(() => console.log('Fetched')),
                catchError(this.handleError<any>())
            );
    }

    getProvinces(): Observable<any> {
        return this.http.get<any>(`${apiUrl}/provinces`)
            .pipe(
                tap(() => console.log('Fetched')),
                catchError(this.handleError<any>())
            );
    }

    getDistricts(provinceId: any): Observable<any> {
        let params: any = {
            provinceId: provinceId,
        };
        return this.http.get<any>(`${apiUrl}/districts`, { params: params })
            .pipe(
                tap(() => console.log('Fetched')),
                catchError(this.handleError<any>())
            );
    }

    getWards(districtId: any): Observable<any> {
        let params: any = {
            districtId: districtId,
        };
        return this.http.get<any>(`${apiUrl}/wards`, { params: params })
            .pipe(
                tap(() => console.log('Fetched')),
                catchError(this.handleError<any>())
            );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            this.alertService.error("Service Errors");
            return of(result as T);
        };
    }
}