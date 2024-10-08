import { CollectionViewer, DataSource } from "@angular/cdk/collections"
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { TransporterService } from "src/app/services/transporter.service";
import { MappingModels } from "src/app/shared/models/mappingModels";

export class TransporterDataSource implements DataSource<any>{
    private dataSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    public count!: number;

    constructor(private transporterService: TransporterService,
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
        this.transporterService.getTransporters(queryParams, pageIndex, pageSize, sortDirection).pipe(
            catchError(() => of()),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(data => {
                this.dataSubject.next(this.mappingModels.ToDisplayTransporterDtos(data));
            });

        this.transporterService.getTransporterCount(queryParams).pipe(
            catchError(() => of()),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(data => {
                this.count = data;
            });
    }
}