import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { AlertService } from 'src/app/services/alert.service';
import { SettingService } from 'src/app/services/setting.service';
import { StaffService } from 'src/app/services/staff.service';
import { ConfigService } from 'src/app/shared/config.service';

@Component({
    selector: 'app-edit-staff-permission',
    templateUrl: './edit-staff-permission.component.html',
    styleUrls: []
})

export class EditStaffPermissionComponent implements OnInit {
    staff!: any;
    permissionGroups: any[] = [];
    permissionGroupSelected!: any[];

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private fb: FormBuilder,
        private alertService: AlertService,
        private configService: ConfigService,
        private staffService: StaffService,
        private settingService: SettingService,
        public dialogRef: MatDialogRef<EditStaffPermissionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    };

    ngAfterViewInit(): void {
    };

    ngOnInit(): void {
        this.staff = this.data;
        this.getPermissionGroupByName();
    };

    okClick(): void {
        let PermissionGroupIds = this.permissionGroupSelected.map((c: any) => c.id);
        this.staffService.updateStaffPermissionGroups(this.data.id, PermissionGroupIds).subscribe((res: any) => {
            this.dialogRef.close();
        })
    }

    close() {
        this.dialogRef.close();
    }

    onSelectPermissionGroups(event: any) {
        this.permissionGroupSelected = event.selectedOptions.map((c: any) => {
            return {
                id: c.id, name: c.name
            }
        });
        let name = event.searchValue;
        this.getPermissionGroupByName(name);
    }

    getPermissionGroupByName(name: string = '') {
        let queryParams: any = {};

        if (name && name !== '') {
            queryParams.name = name;
        }

        let permissionSelectedIds = this.permissionGroupSelected?.map((c: any) => c.id) ?? [];

        this.settingService.getPermissionGroups(queryParams, 0, 100).subscribe((res: any) => {
            if (res) {
                this.permissionGroups = res.filter((c: any) => !permissionSelectedIds.includes(c.id));
            }
        })
    }


}