import { CollectionViewer, DataSource } from "@angular/cdk/collections"
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { CustomerService } from "src/app/services/customer.service";
import { ShopService } from "src/app/services/shop.service";

import { MappingModels } from "src/app/shared/models/mappingModels";


export class CustomerDataSource implements DataSource<any>{
    private dataSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    public count!: number;

    constructor(private customerService: CustomerService,
        private mappingModels: MappingModels
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
                this.dataSubject.next(this.mappingModels.ToDisplayCustomerDtos(paggedData.data));
                this.count = paggedData.totalRecords;
            });
    }
}