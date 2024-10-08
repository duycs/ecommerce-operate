import { CollectionViewer, DataSource } from "@angular/cdk/collections"
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { CustomerService } from "src/app/services/customer.service";



export class CustomerWaitActiveDataSource implements DataSource<any>{
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

    loadData(queryParams: any, pageIndex = 0, pageSize = 10, sortDirection = 'asc',) {
        

        this.loadingSubject.next(true);
        this.customerService.getCustomers(queryParams, pageIndex, pageSize, sortDirection).pipe(
                catchError(() => of()),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(paggedData => {
                this.dataSubject.next(paggedData.data);
                this.count = paggedData.totalRecords;
            });
    }
}