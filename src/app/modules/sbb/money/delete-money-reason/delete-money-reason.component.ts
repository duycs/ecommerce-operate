import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "src/app/services/alert.service";
import { OrderService } from "src/app/services/order.service";

@Component({
    selector: 'app-delete-money-reason',
    templateUrl: './delete-money-reason.component.html',
})

export class DeleteMoneyReasonComponent {
    constructor(
        private orderService: OrderService,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<DeleteMoneyReasonComponent>,
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