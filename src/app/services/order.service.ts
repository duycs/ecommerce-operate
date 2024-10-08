import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { OrderDetailDto } from '../shared/models/order/orderDetailDto';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = environment.apiOrderUrl;

@Injectable({
    providedIn: 'root'
})
export class OrderService extends BaseService {

    constructor(private http: HttpClient) {
        super();
    }

    // Đơn hàng từ khách: list order, list order count, order detail
    getOrders(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        return this.http.get<any>(`${apiUrl}/order`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getOrderCount(queryParams: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/order/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getOrder(id: any): Observable<OrderDetailDto> {
        return this.http.get<any>(`${apiUrl}/order/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );

    }


    // Đơn chuyển hàng từ NCC: order delivery
    getOrderDeliveries(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        return this.http.get<any>(`${apiUrl}/order/delivery`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getOrderDeliveryCount(queryParams: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/order/delivery/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getOrderDelivery(id: any): Observable<any> {
        console.log("id", id);
        return this.http.get<any>(`${apiUrl}/order/delivery/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );

    }

    createOrderDeliveryImport(id: any, data: any) {
        return this.http.post<any>(`${apiUrl}/order/delivery/${id}/import`, data).pipe(
            tap((dto: any) => console.log(`Created: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }


    // Danh sách đơn hàng con: order supplier
    getOrderSuppliers(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        return this.http.get<any>(`${apiUrl}/order/supplier`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getOrderSupplierCount(queryParams: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/order/supplier/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getOrderSupplier(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/order/supplier/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }


    // Đơn nhập hàng NCC: receipt import
    getOrderReceiptImports(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        return this.http.get<any>(`${apiUrl}/receipt/import`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getOrderReceiptImportCount(queryParams: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/receipt/import/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getOrderReceiptImport(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/receipt/import/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    // Đơn giao hàng: receipt export
    getOrderReceiptExports(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        return this.http.get<any>(`${apiUrl}/receipt/export`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getOrderReceiptExportCount(queryParams: any = {}): Observable<any> {
        return this.http.get<any>(`${apiUrl}/receipt/export/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );
    }

    getOrderReceiptExport(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/receipt/export/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );

    }

    // Tạo đơn giao hàng cho khách tại màn hình Đơn hàng từ khách hàng
    createOrderReceiptExport(data: any) {
        return this.http.post<any>(`${apiUrl}/receipt/export`, data).pipe(
            tap((dto: any) => console.log(`Created: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }


    // create, update
    createOrder(data: any) {
        return this.http.post<any>(apiUrl, data).pipe(
            tap((dto: any) => console.log(`Created: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    confirmOrders(data: any) {
        return this.http.post<any>(`${apiUrl}/confirm`, data).pipe(
            tap((dto: any) => console.log(`Created: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    updateOrder(data: any) {
        return this.http.put<any>(`${apiUrl}`, data).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    deleteOrder(id: any) {
        return this.http.delete<any>(`${apiUrl}/${id}`).pipe(
            tap(() => console.log(`Deleted`)),
            catchError(this.handleError)
        );
    }


    updateDeliveryCompleted(id: any, data: any) {
        return this.http.put<any>(`${apiUrl}/order/delivery/${id}/completed`, data).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    // Duyệt đơn trong Đơn hàng từ khách
    updateOrderConfirm(id: any) {
        return this.http.post<any>(`${apiUrl}/order/${id}/confirm`, {}).pipe(
            tap((dto: any) => console.log(`Updated: ${JSON.stringify(dto)}`)),
            catchError(this.handleError)
        );
    }

    // action khi in phiếu
    requeueOrderReceiptPickups(id: any): Observable<any> {
        return this.http.post<any>(`${apiUrl}/receipt/pickup/${id}/requeue`, {})
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );

    }


    getOrderReceiptPickups(queryParams: any, page: number, size: number, sort: any = 'asc'): Observable<any> {
        return this.http.get<any>(`${apiUrl}/receipt/pickup`, { params: this.getQueryParams(queryParams, page, size, sort) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );

    }

    getCountOrderReceiptPickup(queryParams: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/receipt/pickup/count`, { params: this.getQueryParams(queryParams) })
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );

    }

    getOrderReceiptPickup(id: any): Observable<any> {
        return this.http.get<any>(`${apiUrl}/receipt/pickup/${id}`)
            .pipe(
                tap((dto: any) => { }),
                catchError(this.handleError)
            );

    }

    getQueryParams(queryParams: any, page: number = 0, size: number = 10, sort: any = {}) {
        let formObject: any = {};
        if (queryParams?.id) formObject.id = queryParams?.id;
        if (queryParams?.code) formObject.code = queryParams?.code;
        if (queryParams?.orderCode) formObject.orderCode = queryParams?.orderCode;
        if (queryParams?.note) formObject.note = queryParams?.note;
        if (queryParams?.customerId) formObject.customerId = queryParams?.customerId;
        if (queryParams?.shopId) formObject.shopId = queryParams?.shopId;
        if (queryParams?.status) formObject.status = queryParams?.status;
        if (queryParams?.quantityStatus) formObject.quantityStatus = queryParams?.quantityStatus;
        if (queryParams?.deliveryOrderId) formObject.deliveryOrderId = queryParams?.deliveryOrderId;
        if (queryParams?.productSku) formObject.productSku = queryParams?.productSku;
        if (queryParams?.transporterId) formObject.transporterId = queryParams?.transporterId;


        if (queryParams?.code) formObject.code = queryParams?.code;
        if (queryParams?.payDate) formObject.payDate = queryParams?.payDate;
        if (queryParams?.exportReceiptCode) formObject.exportReceiptCode = queryParams?.exportReceiptCode;
        if (queryParams?.department) formObject.department = queryParams?.department;
        if (queryParams?.customer) formObject.customer = queryParams?.customer;

        if (page) { formObject.page = page } else formObject.page = 0;
        if (size) { formObject.size = size } else formObject.size = 10;
        if (sort) { formObject.sort = sort }

        return new HttpParams({
            fromObject: formObject
        });
    }

}