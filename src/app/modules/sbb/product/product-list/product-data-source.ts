import { CollectionViewer, DataSource } from "@angular/cdk/collections"
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { ProductService } from "src/app/services/product.service";
import { MappingModels } from "src/app/shared/models/mappingModels";
import { ProductDto } from "src/app/shared/models/product/productDto";


export class ProductDataSource implements DataSource<any>{
    private dataSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    public count!: number;

    constructor(private productService: ProductService,
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

        this.productService.getProducts(queryParams, pageIndex, pageSize, sortDirection).pipe(
            catchError(() => of()),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(paggedData => {
                
                this.dataSubject.next(this.mappingModels.ToDisplayProductDtos(paggedData));
            });

        this.productService.getCount(queryParams).pipe(
            catchError(() => of()),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(data => {
                this.count = data;
        });
    
    }
}