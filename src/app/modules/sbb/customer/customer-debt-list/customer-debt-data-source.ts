import { CollectionViewer, DataSource } from "@angular/cdk/collections"
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { CustomerService } from "src/app/services/customer.service";
import { ShopService } from "src/app/services/shop.service";



export class CustomerDebtDataSource implements DataSource<any>{
    private dataSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    public count!: number;

    constructor(private customerService: CustomerService
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.dataSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.dataSubject.complete();
        this.loadingSubject.complete();
    }

    loadData(id: any, queryParams: any, pageIndex = 0, pageSize = 10, sortDirection: any = {}) {
        

        this.loadingSubject.next(true);
        this.customerService.getCustomerDebts(id, queryParams, pageIndex, pageSize, sortDirection).pipe(
            catchError(() => of()),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(data => {
                
                this.dataSubject.next(data);
            });

        this.customerService.getCustomerDebtCount(id, queryParams).pipe(
            catchError(() => of()),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(data => {
                this.count = data;
            });
    }
}