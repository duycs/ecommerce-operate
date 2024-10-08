import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "src/app/services/alert.service";
import { ProductService } from "src/app/services/product.service";

@Component({
    selector: 'app-delete-product',
    templateUrl: './delete-product.component.html',
})

export class DeleteProductComponent {
    constructor(
        private productService: ProductService,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<DeleteProductComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onRemove(id: number) {
        this.productService.deleteProduct(id).subscribe(res => {
            this.alertService.showToastSuccess();
        }, err => {
            console.log(err);
        });
    };

}