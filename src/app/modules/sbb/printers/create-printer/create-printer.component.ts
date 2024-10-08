import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { DepartmentService } from 'src/app/services/department.service';
import { CreateProductPriceSettingComponent } from '../../product/create-product-price-setting/create-product-price-setting.component';

@Component({
    selector: 'app-printer-permission',
    templateUrl: './create-printer.component.html',
    styleUrls: []
})

export class CreatePrinterComponent implements OnInit {
    form!: FormGroup;
    categorySelected: any[] = [];
    categories!: any;

    printerSelected: any[] = [];
    printers!: any;

    departments: any[] = [];

    constructor(
        private fb: FormBuilder,
        private depertmentService: DepartmentService,
        private alertService: AlertService,
        private router: Router,
        public dialogRef: MatDialogRef<CreateProductPriceSettingComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    };

    ngAfterViewInit(): void {
    };

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [null, Validators.required],
            code: [null, Validators.required],
            description: [null],
            active: [false, Validators.required],
        });
    };

    save() {
        let data: any = {
            name: this.form.get('name')?.value,
            code: this.form.get('code')?.value,
            active: this.form.get('active')?.value,
            description: this.form.get('description')?.value,
            categoryIds: this.categorySelected.map((c: any) => c.id),
            printerIds: this.printerSelected.map((c: any) => c.id)
        };

        this.depertmentService.createDepartment(data).subscribe(() => {
            this.alertService.showToastSuccess();
        });

        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

}