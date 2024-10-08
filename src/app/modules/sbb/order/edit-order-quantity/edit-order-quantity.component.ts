import { AfterViewInit, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-edit-order-quantity',
    templateUrl: './edit-order-quantity.component.html',
    styleUrls: ['./edit-order-quantity.component.css']
})

export class EditOrderQuantityComponent implements OnInit, AfterViewInit, OnDestroy {
    form!: FormGroup;
    inputCounterConfig = {
        value: 0,
        step: 1,
        min: 0,
        max: Infinity,
        wrap: false,
        color: 'primary'
    }
    brand = '';
    category = '';
    product!: any;
    tabSelected: any = new FormControl(0);

    constructor(private fb: FormBuilder,
        private productService: ProductService,
        private dialogRef: MatDialogRef<EditOrderQuantityComponent>,
        private alertService: AlertService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }
    ngOnDestroy(): void {
    }

    ngAfterViewInit(): void {
        if (!this.product) {
            this.getProductThenBind();

            this.product = this.mappingDisplayProductAttribute(this.data.product, this.data.isUpdate);
            let selectedTabIndex = this.data.selectedTabIndex ?? 0;
            this.tabSelected.setValue(selectedTabIndex);
        }
    };

    ngOnInit(): void {
    };

    getProductThenBind() {
        this.productService.getProduct(this.data.product.id)
            .subscribe(res => {
                this.brand = res.brand;
                this.category = res.category;
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    mappingDisplayProductAttribute(product: any, isUpdate: boolean = false) {

        let attributes = product.children.map((c: any) => {
            return c.attributes
        }).flat(1) as any[];

        attributes = attributes.map((a: any) => {
            if (a.priority === 1) {
                a.code = 'color'
            } else if (a.priority === 2) {
                a.code = 'size'
            }

            return a;
        }) as any[];

        attributes = [...new Map(attributes.map((m: any) => [m.id, m])).values()];

        product.attributes = attributes;

        let colorSizes: any[] = [];
        let colors = product.attributes.filter((a: any) => a.code === 'color');
        colors.forEach((c: any) => {
            let sizes: any[] = [];
            let quantity = 0;
            let childId: any;
            let colorId: any;
            let matchColor = false;
            product.children.forEach((child: any) => {
                child.attributes.forEach((a: any) => {
                    if (a.id === c.id) {
                        matchColor = true;
                        colorId = c.id;
                        childId = child.id;
                        let sizeNumbers = child.attributes.filter((a: any) => a.code === 'size').map((s: any) => {
                            return {
                                id: childId,
                                size: ~~s.name,
                                name: s.name,
                                sku: child.sku,
                                quantity: isUpdate ? child.quantity : 0,
                            }
                        });

                        if (sizeNumbers && sizeNumbers.length > 0) {
                            sizes.push(...sizeNumbers)
                        }

                        quantity = child.quantity;
                    }
                });

            });

            if (matchColor) {
                colorSizes.push({
                    id: c.id,
                    name: c.name,
                    code: c.name,
                    sizes: sizes,
                    total: this.sumQuantity(sizes),
                    sizeAll: 1
                });
            }
        });

        product.colorSizes = colorSizes;

        return product;
    }

    changeInputCounter(event: any) {
        let colorSize = this.product.colorSizes.filter((c: any) => c.id === event.groupId);
        let sizes = colorSize.map((c: any) => c.sizes).flat(1);

        sizes.forEach((s: any) => {
            if (s.id === event.id) {
                s.quantity = event.value;
            }
        })

        this.product.colorSizes.forEach((c: any) => {
            if (c.id === event.groupId) {
                c.total = this.sumQuantity(sizes);
            }
        })
    }

    changeInputCounterAll(event: any) {
        this.product.colorSizes.forEach((c: any) => {
            if (c.id === event.groupId) {
                c.sizes.forEach((s: any) => {
                    s.quantity = event.value;
                })
                c.total = this.sumQuantity(c.sizes);
            }
        })
    }

    sumQuantity(sizes: any[]) {
        if (sizes && sizes.length > 0) {
            return sizes.map((s: any) => s.quantity).reduce(function (a, c) {
                return a + c;
            })

        } else return;
    }

    save() {
        let data: any;
        let allSizes = this.product.colorSizes?.map((c: any) => c.sizes).flat(1);

        if (allSizes && allSizes.length > 0) {
            this.product.children.forEach((p: any) => {
                allSizes.forEach((s: any) => {
                    if (s.id === p.id) {
                        p.quantity = s.quantity;
                    }
                }
                );
            });

            data = this.product;

            this.product = null; // have to set null to destroy
        }

        setTimeout(() => {
            this.dialogRef.close({ event: "save", data: data }); // ERROR TypeError: instanceCleanupFn is not a function => set product = null to destroy
        }, 500);
    }

    close() {
        this.dialogRef.close();
    }

    addColor() { }
}