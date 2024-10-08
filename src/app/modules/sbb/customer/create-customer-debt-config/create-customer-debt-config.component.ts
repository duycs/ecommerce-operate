import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ConfigService } from 'src/app/shared/config.service';

const ELEMENT_DATA: any[] = [
    { numbericalOrder: 1, name: 'Duy', phone: '0914376766', currentDebtLimit: 200000, debtLimit: 10000, note: 'abcd' },
];

@Component({
    selector: 'app-create-customer-debt-config',
    templateUrl: './create-customer-debt-config.component.html',
    styleUrls: ['./create-customer-debt-config.component.css']
})

export class CreateCustomerDebtConfigComponent implements OnInit {
    form!: FormGroup;
    customerId!: any;
    displayedColumns: string[] = ['numericalOrder', 'name', 'phone', 'currentDebtLimit', 'debtLimit', 'note', 'action'];
    price!: number;
    upPrice!: number;
    note!: number;
    customers: any = [];
    customerSelected!: any;
    dataSource = new MatTableDataSource<any>();
    isLoading = true;
    pageNumber: number = 1;
    isEditableNew: boolean = true;
    currentDebtLimitText = "";
    newDebtLimitText = "";
    customerDebtLimits: any = [];
    length = 50;
    pageSize = 10;
    pageIndex = 1;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private fb: FormBuilder,
        private configService: ConfigService,
        private activeRoute: ActivatedRoute,
        private customerService: CustomerService,
        private alertService: AlertService,
        private renderer: Renderer2,
    ) {
    };

    ngAfterViewInit(): void {
        this.form.get("currentDebtLimit")?.valueChanges.subscribe(value => {
            this.currentDebtLimitText = `(bằng chữ: ${this.configService.getCurrencyInVietnamWord(value)})`;
        });

        this.form.get("newDebtLimit")?.valueChanges.subscribe(value => {
            this.newDebtLimitText = `(bằng chữ: ${this.configService.getCurrencyInVietnamWord(this.configService.getCurrencyValue(value))})`;
        });
    };

    ngOnInit(): void {
        this.customerId = this.activeRoute.snapshot.params['id'];
        this.getCustomers();
        this.form = this.fb.group({
            customerId: [null, Validators.required],
            newDebtLimit: [null, Validators.required],
            currentDebtLimit: [null, Validators.required],
            note: [null],
        });

        this.form.get("customerId")?.valueChanges.subscribe(value => {
            this.customerSelected = this.customers.find((c: any) => c.id === value);
            this.form.get("currentDebtLimit")?.setValue(this.customerSelected?.debtLimit ?? 0);
        });
    };

    updateMoneyDisplay(event: any){
        let displayValue = this.configService.getCurrencyDisplay(event.target.value);
        this.form.get("newDebtLimit")?.setValue(displayValue);
      }

    getCustomers() {
        let customerQueryParams = {} as any;
        this.customerService.getCustomers(customerQueryParams, 0, 10000).subscribe((pageData) => {
            this.customers = pageData.data;
        });
    }

    addProductCode() {
    }

    addSetting() {
        let customerId = this.form.get('customerId')?.value;
        let customer = this.customers.find((c: any) => c.id === customerId);
        let newDebtLimit = this.configService.getCurrencyValue(this.form.get('newDebtLimit')?.value);
        let customerDebtLimit: any = {
            customer: customer,
            currentDebtLimit: this.form.get('currentDebtLimit')?.value,
            newDebtLimit: newDebtLimit,
            note: this.form.get('note')?.value ?? ''
        };

        if (newDebtLimit && newDebtLimit > 0) {
            this.remove(customerDebtLimit);
            this.customerDebtLimits.push(customerDebtLimit);
            this.dataSource.data = this.customerDebtLimits;
        }else {
            this.renderer.selectRootElement('#newDebtLimit').focus();
        }
    }

    openRemoveDialog(element: any) {

    }

    save() {
        let customerDebtLimits = this.customerDebtLimits.map((c: any) => (
            {
                customerId: c.customer.id,
                newDebtLimit: c.newDebtLimit,
                note: c.note
            }
        ));

        let data = {
            customerDebtLimits: customerDebtLimits
        };

        console.log("data", data);

        this.customerService.createCustomerDebtLimits(data)
            .subscribe(() => {
                this.alertService.showToastSuccess();
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });

    }

    remove(element: any) {
        this.customerDebtLimits = this.customerDebtLimits.filter((c: any) => c.customer.id !== element.customer.id);
        this.dataSource.data = this.customerDebtLimits;
    }

    handlePageEvent(e: PageEvent) {
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
    }
}