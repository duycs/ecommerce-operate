import { CollectionViewer, DataSource } from "@angular/cdk/collections"
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { ShopService } from "src/app/services/shop.service";
import { StaffService } from "src/app/services/staff.service";
import { MappingModels } from "src/app/shared/models/mappingModels";

export class StaffAccountDataSource implements DataSource<any>{
    private dataSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    public count!: number;

    constructor(private staffService: StaffService,
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
        this.staffService.getStaffs(queryParams, pageIndex, pageSize, sortDirection).pipe(
            catchError(() => of()),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(data => {
                this.dataSubject.next(this.mappingModels.MappingStaffs(data));
            });

        this.staffService.getStaffCount(queryParams).pipe(
            catchError(() => of()),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(data => {
                this.count = data;
            });
    }
}