import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "src/app/services/alert.service";
import { ProductService } from "src/app/services/product.service";

@Component({
    selector: 'app-update-product-status',
    templateUrl: './update-product-status.component.html',
})

export class UpdateProductStatusComponent implements OnInit {
    form!: FormGroup;
    title: string = "";

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<UpdateProductStatusComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
        this.title = "Update status to " + this.data.product.status;
        this.form = this.fb.group({
            title: [this.title],
            description: [null],
        });
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    onUpdate(data: any) {
        let updateProductStatusVM: any = {
            productId: data.product.id,
            status: data.product.status,
        };
        this.productService.updateProductStatus(updateProductStatusVM)
            .subscribe(res => {
                this.alertService.showToastSuccess();
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    };

}