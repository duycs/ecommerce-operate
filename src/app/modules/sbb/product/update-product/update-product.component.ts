import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "src/app/services/alert.service";
import { ProductService } from "src/app/services/product.service";

@Component({
    selector: 'app-update-product',
    templateUrl: './update-product.component.html',
})

export class UpdateProductComponent implements OnInit {
    form!: FormGroup;
    title: string = "";
    titleDefault: string = "";
    product!: any;

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<UpdateProductComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
        this.form = this.fb.group({
            title: [this.title],
            description: [null],
        });
    }

    getProduct() {
        this.productService.getProduct(this.data.product.id)
          .subscribe(res => {
            this.product = res;
          }, (err) => {
            this.alertService.showToastError();
            console.log(err);
          });
      }
    

    onCancelClick(): void {
        this.dialogRef.close();
    }

    onUpdate(data: any) {
        let updateProductStatusVM: any = {
            productId: data.product.id,
            name: this.form.get("name")?.value,
            description: this.form.get("description")?.value,
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