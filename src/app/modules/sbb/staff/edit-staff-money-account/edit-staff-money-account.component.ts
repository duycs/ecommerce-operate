import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccountantService } from 'src/app/services/accountant.service';
import { AlertService } from 'src/app/services/alert.service';
import { StaffService } from 'src/app/services/staff.service';

@Component({
    selector: 'app-edit-staff-money-account',
    templateUrl: './edit-staff-money-account.component.html',
    styleUrls: []
})

export class EditStaffMoneyAccountComponent implements OnInit {
    staff!: any;
    moneyAccounts: any[] = [];
    moneyAccountSelected!: any[];

    constructor(private fb: FormBuilder,
        private alertService: AlertService,
        private staffService: StaffService,
        private accountantService: AccountantService,
        public dialogRef: MatDialogRef<EditStaffMoneyAccountComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    };

    ngAfterViewInit(): void {
    };

    ngOnInit(): void {
        this.staff = this.data;
        this.moneyAccounts = this.staff.staffMoneyAccounts.map((c: any) => { return { name: c.moneyAccountName, id: c.moneyAccountId } });
        this.staff.moneyAccounts = this.moneyAccounts;
        this.getMoneyAccountByName();
    };

    onSelectMoneyAccounts(event: any) {
        this.moneyAccountSelected = event.selectedOptions.map((c: any) => {
            return {
                id: c.id, name: c.name
            }
        });
        let name = event.searchValue;
        this.getMoneyAccountByName(name);
    }

    getMoneyAccountByName(name: string = '') {
        let queryParams: any = {};

        if (name && name !== '') {
            queryParams.name = name;
        }

        let moneyAccountSelectedIds = this.moneyAccountSelected?.map((c: any) => c.id) ?? [];
        this.accountantService.getMoneyAccounts(queryParams, 0, 10000).subscribe((data) => {
            if (data && data.length > 0) {
                this.moneyAccounts = data.filter((c: any) => !moneyAccountSelectedIds.includes(c.id));
            }
        });
    }

    save(): void {
        let moneyAccountIds = this.moneyAccountSelected.map((c: any) => c.id);
        this.staffService.updateMoneyAccounts(this.staff.id, moneyAccountIds).subscribe(() => {
            this.alertService.showToastMessage("Cập nhật tài khoản tiền thành công");
        });

        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

}