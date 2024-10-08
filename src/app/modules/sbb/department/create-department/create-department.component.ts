import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { DepartmentService } from 'src/app/services/department.service';
import { ProductService } from 'src/app/services/product.service';
import { SettingService } from 'src/app/services/setting.service';
import { ConfigService } from 'src/app/shared/config.service';

@Component({
    selector: 'app-department-permission',
    templateUrl: './create-department.component.html',
    styleUrls: []
})

export class CreateDepartmentComponent implements OnInit {
    form!: FormGroup;
    categorySelected: any[] = [];
    categories!: any;

    printerSelected: any[] = [];
    printers!: any;

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private depertmentService: DepartmentService,
        private alertService: AlertService,
        private router: Router
    ) {
    };

    ngAfterViewInit(): void {
    };

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [null, Validators.required],
            code: [null, Validators.required],
            active: [false, Validators.required],
            description: [null],
        });

        this.getCategoryByName();
        this.getPrintByName();
    };

    onSelectCategory(event: any) {
        this.categorySelected = event.selectedOptions.map((c: any) => {
            return {
                id: c.id, name: c.name
            }
        });

        let name = event.searchValue;

        this.getCategoryByName(name);
    }

    getCategoryByName(name: string = '') {
        let queryParams: any = {};

        if (name && name !== '') {
            queryParams.name = name;
        }

        let ids = this.categorySelected?.map((c: any) => c.id) ?? [];
        this.categories = this.productService.getProductCategories({}, 0, 1000).subscribe((res: any) => {
            this.categories = res.data.filter((c: any) => !ids.includes(c.id))
        });
    }

    onSelectPrint(event: any) {
        this.printerSelected = event.selectedOptions.map((c: any) => {
            return {
                id: c.id, name: c.name
            }
        });

        let name = event.searchValue;

        this.getPrintByName(name);
    }

    getPrintByName(name: string = '') {
        let queryParams: any = {};

        if (name && name !== '') {
            queryParams.name = name;
        }

        let ids = this.printerSelected?.map((c: any) => c.id) ?? [];
        this.printers = this.depertmentService.getPrints({}, 0, 1000).subscribe((res: any) => {
            this.categories = res.filter((c: any) => !ids.includes(c.id))
        });
    }

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
            this.router.navigateByUrl(`/sbb/departments`);
        })
    }

}