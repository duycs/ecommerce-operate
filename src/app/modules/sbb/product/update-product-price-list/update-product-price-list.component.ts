import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';
import { ConfigService } from 'src/app/shared/config.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';


@Component({
    selector: 'app-update-product-price-list',
    templateUrl: './update-product-price-list.component.html',
    styleUrls: ['./update-product-price-list.component.css']
})

export class UpdateProductPriceListComponent implements OnInit {
    form!: FormGroup;
    displayedColumns: string[] = ['orderNumber', 'image', 'name', 'shop', 'category', 'brand', 'price', 'upPrice', 'type', 'status', 'note', 'action'];
    products: any = [];
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
        private renderer: Renderer2,
        private configService: ConfigService,
        private alertService: AlertService
    ) {
    };

    ngAfterViewInit(): void {
        this.setTextType();
    };

    ngOnInit(): void {
        this.form = this.fb.group({
            type: ["1", Validators.required],
            upPrice: [null],
            upPriceAll: [null],
            note: [null],
        });

        this.getProductsByName();

        this.form.get("type")?.valueChanges.subscribe(value => {
            this.setTextType();
        });

        this.form.get("upPrice")?.valueChanges.subscribe(value => {
            let upPrice = this.configService.getCurrencyInVietnamWord(value);
            this.upPriceText = `(bằng chữ: ${upPrice})`;
        });

        this.form.get("upPriceAll")?.valueChanges.subscribe(value => {
            let upPriceAll = this.configService.getCurrencyInVietnamWord(value);
            this.upPriceTextAll = `(bằng chữ: ${upPriceAll})`;
        });
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

    getProductsByName(name?: any) {
        let queryParams: any = {};
        if (name) queryParams.name = name;

        let upPrice = ~~this.form.get("upPrice")?.value ?? 0;

        this.productService.getProducts(queryParams, 0, 10).pipe()
            .subscribe(data => {
                if (data && data.length > 0) {
                    this.products = data.map((c: any) => {
                        return {
                            id: c.id,
                            name: `${c.name} - giá: ${this.currencyPipe.transform(c.maxPrice, 'VND')}`,
                            image: c.image,
                            brand: c.brand,
                            category: c.category,
                            shop: c.shop,
                            price: c.maxPrice
                        }
                    });
                    this.setSelectedProductsByType(upPrice);
                }
            });
    }

    addProduct() {
        if (!this.selectedProducts || this.selectedProducts.length === 0) {
            this.alertService.showToastMessage("Hãy chọn sản phẩm");
            return;
        }

        let upPrice = ~~this.form.get("upPrice")?.value;
        this.setSelectedProductsByType(upPrice);

        let typeText = `${this.typeText}: ${upPrice}`;

        this.selectedProducts.forEach((product: any) => {
            let productPriceSetting: any = {
                product: product,
                category: product.category,
                brand: product.brand,
                price: product.price ?? 0,
                upPrice: product.upPrice,
                typeText: typeText,
                note: this.form.get('note')?.value ?? typeText
            };

            if (productPriceSetting) {
                this.remove(productPriceSetting);
                this.productPriceSettings.push(productPriceSetting);
                this.dataSource.data = this.mappingModels.ToDisplayProductPriceSettingDtos(this.productPriceSettings);
            }
        });

    }

    setForAll() {
        let value = this.form.get('upPriceAll')?.value;
        let type = ~~this.form.get("type")?.value;

        if (!value) {
            this.renderer.selectRootElement('#upPriceAll').focus();
            this.alertService.showToastMessage("Hãy nhập giá");
            return;
        }

        let typeText = `${this.typeText}: ${value}`;
        this.productPriceSettings.forEach((product: any) => {
            product = this.setSelectedProductByType(product, type, value);
            product.typeText = typeText
            product.note = typeText
        });

        this.dataSource.data = this.productPriceSettings;
    }

    remove(element: any) {
        this.productPriceSettings = this.productPriceSettings.filter((c: any) => c.product.id !== element.product.id);
        this.dataSource.data = this.productPriceSettings;
    }

    save() {
        if (this.productPriceSettings.length === 0) {
            this.alertService.showToastMessage("Hãy thêm sản phẩm vào danh sách cập nhật giá");
            return;
        }

        let productPriceSettings = this.productPriceSettings.map((c: any) => (
            {
                productId: c.product.id,
                upPrice: c.upPrice,
                note: c.note
            }
        ));

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

    }

    onSelectProduct(event: any) {
        this.selectedProducts = event.selectedOptions.map((c: any) => {
            return {
                id: c.id, name: c.value.name, shop: c.value.shop, image: c.value.image,
                category: c.value.category, brand: c.value.brand, price: c.value.price
            }
        });
        let name = event.searchValue;
        this.getProductsByName(name);
    }

}