import { CollectionViewer, DataSource } from "@angular/cdk/collections"
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { TemplateService } from "src/app/services/template.service";

export class TemplateTransporterCostDataSource implements DataSource<any>{
    private dataSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    public count!: number;

    constructor(private templateService: TemplateService
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


        this.templateService.getTemplates(queryParams, pageIndex, pageSize, sortDirection).pipe(
            catchError(() => of()),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(data => {
            data.forEach((c: any) => {
                c.settings = JSON.parse(c.settings);
            });
            
            this.dataSubject.next(data);
        });

        this.templateService.getCountTemplates(queryParams).pipe(
            catchError(() => of()),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(data => {
            this.count = data;
        });
    }
}