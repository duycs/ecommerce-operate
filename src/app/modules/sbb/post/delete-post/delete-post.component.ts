import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "src/app/services/alert.service";
import { ProductService } from "src/app/services/product.service";

@Component({
    selector: 'app-delete-post',
    templateUrl: './delete-post.component.html',
})

export class DeletePostComponent {
    constructor(
        private productService: ProductService,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<DeletePostComponent>,
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