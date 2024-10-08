import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { PhotoService } from 'src/app/services/photo.service';
import { ProductService } from 'src/app/services/product.service';
import { UploadType } from 'src/app/shared/models/uploadType';

@Component({
    selector: 'app-create-product',
    templateUrl: './create-product.component.html',
    styleUrls: ['./create-product.component.css']
})

export class CreateProductComponent implements OnInit {
    form!: FormGroup;
    units: any[] = [
        { id: 1, name: 'VND' },
        { id: 2, name: 'CNY' },
        { id: 3, name: 'USD' }
    ];
    brands: any[] = [
        { id: 1, name: 'Sony' },
        { id: 2, name: 'Canon' },
        { id: 3, name: 'Nikkon' },
        { id: 4, name: 'Leica' },
    ];
    brandIds = new FormControl();
    unitIds = new FormControl();

    madeins: any[] = [];
    madeinIds = new FormControl();

    productCategories: any[] = [];
    productCategoryIds = new FormControl();

    groupIds = new FormControl();
    images: any[] = [];

    constructor(private fb: FormBuilder,
        private productService: ProductService,
        private photoService: PhotoService,
        private dialogRef: MatDialogRef<CreateProductComponent>,
        private alertService: AlertService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    };

    ngAfterViewInit(): void {
        this.getCategories();
    };

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [null, Validators.required],
            shop: [null, Validators.required],
            sku: [null, Validators.required],
            description: [null],
            category: [null, Validators.required],
            price: [null, Validators.required],
            madein: [null, Validators.required],
            brand: [null, Validators.required],
            status: [null, Validators.required],
        });
    };

    getCategories(): void {
        this.productService.getProductCategories()
            .subscribe(res => {
                this.productCategories = res;
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    getImages() {
        this.images = [];
        this.photoService.getPhotos(UploadType.PRODUCT_IMAGE)
            .subscribe({
                next: (res) => {
                    if (!Array.isArray(res)) {
                        return;
                    };

                    this.images = res;
                },
                error: (err: HttpErrorResponse) => {
                    this.alertService.showToastError();
                    console.log(err);
                }
            });
    }

    deleteAllImages = () => {
        let fileUrls = this.images.map((p: any) => {
            return p.src;
        });

        if (fileUrls.length > 0) {
            this.photoService.removePhotos(fileUrls).subscribe((data: any) => {
                this.getImages();
            });
        }
    }

    uploadImageFinished(event: any) {
        if (event) {
            this.getImages();
        }
    }

    public save(): void {
        let createProduct: any = {
            name: this.form.get('name')?.value,
            description: this.form.get('description')?.value,
            categoryId: this.productCategoryIds?.value,
            madeinId: this.madeinIds?.value,
            brandId: this.brandIds?.value,
            price: ~~this.form.get('price')?.value,
        };

        this.productService.createProduct(createProduct)
            .subscribe(() => {
                this.alertService.showToastSuccess();
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });

        this.dialogRef.close({ event: "save", data: this.form.value });
    }

    close() {
        this.dialogRef.close({ event: "close", data: this.form.value });
    }
}