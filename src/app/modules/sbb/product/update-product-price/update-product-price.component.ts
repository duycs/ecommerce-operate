import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';
import { ConfigService } from 'src/app/shared/config.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';


@Component({
    selector: 'app-update-product-price',
    templateUrl: './update-product-price.component.html',
    styleUrls: ['./update-product-price.component.css']
})

export class UpdateProductPriceComponent implements OnInit {
    form!: FormGroup;
    displayedColumns: string[] = ['orderNumber', 'image', 'name', 'shop', 'category', 'brand', 'price', 'upPrice', 'type', 'status', 'note', 'action'];
    product!: any;
    productPriceSettings: any = [];
    price: any;
    priceText = "";
    upPriceText = "";
    upPriceTextAll = "";
    typeText = "";
    selectedProducts: any = [];

    dataSource = new MatTableDataSource<any>([]);
    isLoading = true;
    pageNumber: number = 1;
    isEditableNew: boolean = true;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private fb: FormBuilder,
        private currencyPipe: CurrencyPipe,
        private productService: ProductService,
        private mappingModels: MappingModels,
        private configService: ConfigService,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<UpdateProductPriceComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    };

    ngAfterViewInit(): void {
        this.setTextType();
    };

    ngOnInit(): void {
        this.product = this.data;

        this.form = this.fb.group({
            type: ["1", Validators.required],
            upPrice: [null],
            note: [null],
        });

        this.form.get("type")?.valueChanges.subscribe(value => {
            this.setTextType();
        });

        this.form.get("upPrice")?.valueChanges.subscribe(value => {
            let upPrice = this.configService.getCurrencyInVietnamWord(value);
            this.upPriceText = `(bằng chữ: ${upPrice})`;
        });

        this.setSelectedProductsByType(this.data.price);
    };

    setSelectedProductsByType(value: number) {
        let type = ~~this.form.get("type")?.value;
        if (this.selectedProducts && this.selectedProducts.length > 0) {
            this.selectedProducts.forEach((product: any) => {
                product = this.setSelectedProductByType(product, type, value);
            });
        }
    }

    setSelectedProductByType(product: any, type: number, value: number) {
        switch (type) {
            case 1:
                product.upPrice = value;
                break;

            case 2:
                product.upPrice = product.price + value;
                break;

            case 3:
                product.upPrice = product.price - value;
                break;

            case 4:
                product.upPrice = product.price + (product.price * value) / 100;
                break;

            case 5:
                product.upPrice = product.price - (product.price * value) / 100;
                break;

            default:
                this.alertService.showToastMessage("Hãy chọn đúng kiểu cập nhật giá");
                break;
        }

        return product;
    }

    setTextType() {
        let type = ~~this.form.get("type")?.value;
        switch (type) {
            case 1:
                this.typeText = "Giá mới";
                break;

            case 2:
                this.typeText = "Tăng thêm";
                break;

            case 3:
                this.typeText = "Giảm bớt";
                break;

            case 4:
                this.typeText = "Tăng %";
                break;

            case 5:
                this.typeText = "Giảm %";
                break;

            default:
                this.alertService.showToastMessage("Hãy chọn đúng kiểu cập nhật giá");
                break;
        }
    }

    okClick(): void {
        let upPrice = ~~this.form.get("upPrice")?.value;
        let type = ~~this.form.get("type")?.value;
        let typeText = `${this.typeText}: ${upPrice}`;
        this.product = this.setSelectedProductByType(this.product, type, upPrice);

        let productPriceSettings: any = [
            {
                productId: this.product.id,
                upPrice: this.product.upPrice,
                note: this.form.get('note')?.value ?? typeText
            }];

        let data = {
            productPriceSettings: productPriceSettings
        };

        this.productService.createProductPriceSettings(data)
            .subscribe(() => {
                this.alertService.showToastSuccess();
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });


        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }
}