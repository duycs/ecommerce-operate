import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "src/app/services/alert.service";
import { OrderService } from "src/app/services/order.service";
import { ProductService } from "src/app/services/product.service";

@Component({
    selector: 'app-delete-order',
    templateUrl: './delete-order.component.html',
})

export class DeleteOrderComponent {
    constructor(
        private orderService: OrderService,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<DeleteOrderComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onRemove(id: number) {
        this.orderService.deleteOrder(id).subscribe(res => {
            this.alertService.showToastSuccess();
        }, err => {
            console.log(err);
        });
    };

}