import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${environment.apiUrl}/modelNames`;
const sizeDefault = 10;

@Injectable({
  providedIn: 'root'
})
export class ServiceName {
  constructor(private http: HttpClient) { }

  getMany(page: number = 0, size: number = sizeDefault, searchValue: string = '', isInclude: boolean = true)
    : Observable<any> {
      
    let params: any = {
      pageNumber: page,
      pageSize: size,
      isInclude: isInclude,
      searchValue: searchValue,
    };

    console.log("params", params);
    
    return this.http.get<any>(apiUrl, { params: params })
      .pipe(
        tap(() => console.log('Fetched')),
        catchError(this.handleError<any>())
      );
  }

  get(id: number): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<any>(url, httpOptions).pipe(
      tap(_ => console.log('Fetched')),
      catchError(this.handleError<any>())
    );
  }

  add(data: any): Observable<any> {
    
    return this.http.post<any>(apiUrl, data, httpOptions).pipe(
      tap((modelName: any) => console.log(`Added: ${JSON.stringify(modelName)}`)),
      catchError(this.handleError<any>())
    );
  }

  update(data: any): Observable<any> {
    const url = `${apiUrl}`
    return this.http.put<any>(url, data, httpOptions).pipe(
      tap(() => console.log('Updated')),
      catchError(this.handleError<any>())
    );
  }

  delete(id: any): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<any>(url, httpOptions).pipe(
      tap(_ => console.log('Deleted')),
      catchError(this.handleError<any>())
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); 
      return of(result as T);
    };
  }
}