import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${environment.apiUrl}/ecommerce/web/accountant`;

@Injectable({
    providedIn: 'root'
})
export class AccountantService extends BaseService {

    constructor(private http: HttpClient) {
        super();
    }

    // tài khoản tiền
    getMoneyAccounts(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        let params = new HttpParams({
            fromObject: queryParams
        });

        return this.http.get<any>(`${apiUrl}/money-accounts`, { params: params })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getMoneyAccount(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/money-accounts/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getMoneyAccountCount(queryParams: any = {}): Observable<any> {
        let params = new HttpParams({
            fromObject: queryParams
        });

        return this.http.get<any>(`${apiUrl}/money-accounts/count`, { params: params })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    createMoneyAccount(data: any) {
        return this.http.post<any>(`${apiUrl}/money-accounts`, data).pipe(
            tap((dto: any) => console.log(`Created: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    updateMoneyAccount(id: any, data: any) {
        return this.http.put<any>(`${apiUrl}/money-accounts/${id}`, data).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }


    // phiếu thu/chi
    getLedgers(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        let params = new HttpParams({
            fromObject: queryParams
        });

        return this.http.get<any>(`${apiUrl}/ledgers`, { params: params })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getLedger(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/ledgers/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getLedgerCount(queryParams: any = {}): Observable<any> {
        let params = new HttpParams({
            fromObject: queryParams
        });

        return this.http.get<any>(`${apiUrl}/ledgers/count`, { params: params })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    createLedger(data: any) {
        return this.http.post<any>(`${apiUrl}/ledgers`, data).pipe(
            tap((dto: any) => console.log(`Created: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }


    // phiếu nhập/xuất
    getMoneyImportExports(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        let params = new HttpParams({
            fromObject: queryParams
        });

        return this.http.get<any>(`${apiUrl}/money-import-exports`, { params: params })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getMoneyImportExport(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/money-import-exports/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getMoneyImportExportCount(queryParams: any = {}): Observable<any> {
        let params = new HttpParams({
            fromObject: queryParams
        });

        return this.http.get<any>(`${apiUrl}/money-import-exports/count`, { params: params })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    createMoneyImportExport(data: any) {
        return this.http.post<any>(`${apiUrl}/money-import-exports`, data).pipe(
            tap((dto: any) => console.log(`Created: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }


    // lý do thu chi
    getMoneyReasons(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        let params = new HttpParams({
            fromObject: queryParams
        });

        return this.http.get<any>(`${apiUrl}/money-reasons`, { params: params })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getMoneyReason(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/money-reason/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getMoneyReasonCount(queryParams: any = {}): Observable<any> {
        let params = new HttpParams({
            fromObject: queryParams
        });

        return this.http.get<any>(`${apiUrl}/money-reasons/count`, { params: params })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    createMoneyReason(data: any) {
        return this.http.post<any>(`${apiUrl}/money-reasons`, data).pipe(
            tap((dto: any) => console.log(`Created: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    updateMoneyReason(id: any, data: any) {
        return this.http.put<any>(`${apiUrl}/money-reasons/${id}`, data).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }


    // tổng hợp thu chi
    getMoneyTransactions(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        let params = new HttpParams({
            fromObject: queryParams
        });

        return this.http.get<any>(`${apiUrl}/money-transactions`, { params: params })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getMoneyTransaction(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/money-transactions/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getMoneyTransactionCount(queryParams: any = {}): Observable<any> {
        let params = new HttpParams({
            fromObject: queryParams
        });

        return this.http.get<any>(`${apiUrl}/money-transactions/count`, { params: params })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    createMoneyTransaction(data: any) {
        return this.http.post<any>(`${apiUrl}/money-transactions`, data).pipe(
            tap((dto: any) => console.log(`Created: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }


    // objects
    getObjects(objectTypeId: any): Observable<any> {
        let params = new HttpParams({
            fromObject: {
                objectTypeId: objectTypeId
            }
        });

        return this.http.get<any>(`${apiUrl}/objects`, { params: params })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getBills(billTypeId: any): Observable<any> {
        let params = new HttpParams({
            fromObject: {
                billTypeId: billTypeId
            }
        });

        return this.http.get<any>(`${apiUrl}/bills`, { params: params })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }



    // Công nợ nhà cung cấp
    getPartnerClearingDebts(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        let params = new HttpParams({
            fromObject: queryParams
        });

        return this.http.get<any>(`${apiUrl}/partner-clearing-debts`, { params: params })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getPartnerClearingDebt(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/partner-clearing-debts/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getPartnerClearingDebtCount(queryParams: any = {}): Observable<any> {
        let params = new HttpParams({
            fromObject: queryParams
        });

        return this.http.get<any>(`${apiUrl}/partner-clearing-debts/count`, { params: params })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    // Tạo mới phiếu thanh toán công nợ
    createPartnerClearingDebt(data: any) {
        return this.http.post<any>(`${apiUrl}/partner-clearing-debts`, data).pipe(
            tap((dto: any) => console.log(`Created: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }


    getDebtTransactions(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        let params = new HttpParams({
            fromObject: queryParams
        });

        return this.http.get<any>(`${apiUrl}/debt-transactions`, { params: params })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getDebtTransaction(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/debt-transactions/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getDebtTransactionCount(queryParams: any = {}): Observable<any> {
        let params = new HttpParams({
            fromObject: queryParams
        });

        return this.http.get<any>(`${apiUrl}/debt-transactions/count`, { params: params })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

}