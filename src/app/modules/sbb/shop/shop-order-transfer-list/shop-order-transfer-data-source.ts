import { CollectionViewer, DataSource } from "@angular/cdk/collections"
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { OrderService } from "src/app/services/order.service";
import { MappingModels } from "src/app/shared/models/mappingModels";


export class ShopOrderTransferDataSource implements DataSource<any>{
    public dataSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    public count!: number;

    constructor(
        private mappingModels: MappingModels,
        private orderService: OrderService
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
        this.orderService.getOrderDeliveries(queryParams, pageIndex, pageSize, sortDirection).pipe(
            catchError(() => of()),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(data => {
                
                this.dataSubject.next(this.mappingModels.MappingDisplayFieldsOfOrderDelivers(data));
            });

        this.orderService.getOrderDeliveryCount(queryParams).pipe(
            catchError(() => of()),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(data => {
                this.count = data;
        });
    }
}

