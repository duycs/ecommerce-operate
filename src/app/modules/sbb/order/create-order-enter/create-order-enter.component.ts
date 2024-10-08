import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { OrderService } from 'src/app/services/order.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { ProductService } from 'src/app/services/product.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditOrderQuantityComponent } from '../edit-order-quantity/edit-order-quantity.component';
import { AuthService } from 'src/app/core/authentication/auth.service';

@Component({
    selector: 'app-create-order-enter',
    templateUrl: './create-order-enter.component.html',
})

export class CreateOrderEnterComponent implements OnInit, AfterViewInit {
    form!: FormGroup;
    account!: any;
    currentUserSubscription!: Subscription;
    orderId!: any;
    orderDetail!: any;
    staffNote: string = '';
    current!: any;
    products: any[] = [];
    product: any;
    totalQuantityUpdated = 0;
    notDisplayedColumns = ['price', 'percentDiscount', 'cashDiscount', 'totalPrice'];

    constructor(
        private fb: FormBuilder,
        private orderService: OrderService,
        private authService: AuthService,
        private productService: ProductService,
        private alertService: AlertService,
        private activeRoute: ActivatedRoute,
        private router: Router,
        private renderer: Renderer2,
        private mappingModels: MappingModels,
        private dialog: MatDialog,
    ) { }

    ngAfterViewInit(): void {
        this.getOrderDetail();
    }

    ngOnInit(): void {
        this.account = this.authService.getAccount();
        this.form = this.fb.group({
            productId: [null],
            staffNote: [null]
        });

        this.orderId = this.activeRoute.snapshot.params['id'];
    }

    okClick(): void {
    }

    getOrderDetail() {
        this.orderId = this.activeRoute.snapshot.queryParams["orderId"];
        this.orderService.getOrderDelivery(this.orderId).subscribe((res: any) => {
            this.orderDetail = this.mappingModels.MappingDisplayReceiptStatusChips(res);
            this.orderDetail.quantityStatusChips = this.mappingModels.MappingDisplayQuantityStatusByQuantityChips(this.orderDetail.importedQuantity, this.orderDetail.quantity);
        });
    }


    save() {

        if (!this.products || this.products.length == 0) {
            this.alertService.showToastMessage("Không có sản phẩm");
        }

        let products = this.products.map((p: any) => {
            return {
                id: p.id,
                children: p.children.filter((c: any) => c.quantity !== 0).map((c: any) => { return { id: c.id, quantity: c.quantity } })
            }
        });

        let data = {
            note: this.form.get('staffNote')?.value,
            products: products
        };

        

        this.orderService.createOrderDeliveryImport(this.orderId, data)
            .subscribe(() => {
                this.alertService.showToastSuccess();
                this.router.navigateByUrl("/sbb/order-transfers");
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    editProduct() {
        let product = this.orderDetail.products.filter((p: any) => p.id === this.form.get('productId')?.value)[0];

        if (!product) {
            //this.renderer.selectRootElement('#productId').focus();
            this.alertService.showToastMessage("Hãy chọn sản phẩm");
            return;
        }

        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            product: product
        };

        const dialogRef = this.dialog.open(EditOrderQuantityComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(
            result => {
                let product = result?.data;
                if (product) {
                    this.remove(product);
                    this.products.push(product);

                    // remove duplicate
                    this.products.forEach((p: any) => {
                        if (p.id === product.id) {
                            p = product;
                        }
                    })

                    // mapping after update quantity
                    this.products = this.mappingModels.mappingProductOrderDetail(this.products);

                    // remove quantity 0
                    this.products = this.products.filter((c: any) => c.quantity > 0);

                    this.updateTotalQuantity(this.products);
                }
            }
        );
    }

    updateTotalQuantity(products: any): void {
        if (!products || products.length === 0) {
            this.totalQuantityUpdated = 0;
            return;
        };

        // total child quantity in product
        this.products.forEach((product: any) => {
            let totalQuantity = product.children?.map((c: any) => c.quantity)?.reduce(function (total: any, item: any) { return total += item });
            product.totalQuantity = totalQuantity;
        })

        // total quantity products = total all children product
        let quantities = this.products.map((c: any) => c.children).flat(1)?.map((c: any) => c.quantity);
        let totalQuantity = quantities?.reduce(function (total: any, item: any) { return total += item });
        this.totalQuantityUpdated = totalQuantity;
    }

    remove(element: any) {
        this.products = this.products.filter((c: any) => c.id !== element.id);
    }

    outUpdateEvent(event: any) {
        let products = event;
        this.updateTotalQuantity(products);
    }

}