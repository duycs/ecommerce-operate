import { CollectionViewer, DataSource } from "@angular/cdk/collections"
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { AccountantService } from "src/app/services/accountant.service";
import { ShopService } from "src/app/services/shop.service";


export class FundEntryDataSource implements DataSource<any>{
    private dataSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    public count!: number;

    constructor(private accountantService: AccountantService
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
        
        this.accountantService.getMoneyImportExports(queryParams, pageIndex, pageSize, sortDirection).pipe(
            catchError(() => of()),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(data => {
            this.dataSubject.next(data);
        });

        this.accountantService.getMoneyImportExportCount(queryParams).pipe(
            catchError(() => of()),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(data => {
            this.count = data;
        });
    }
}