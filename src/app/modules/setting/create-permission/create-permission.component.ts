import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { SettingService } from 'src/app/services/setting.service';
import { ConfigService } from 'src/app/shared/config.service';

const ELEMENT_DATA: any[] = [
    { numbericalOrder: 1, name: 'Duy', phone: '0914376766', currentDebtLimit: 200000, debtLimit: 10000, note: 'abcd' },
];

@Component({
    selector: 'app-create-permission',
    templateUrl: './create-permission.component.html',
    styleUrls: []
})

export class CreatePermissionComponent implements OnInit {
    form!: FormGroup;
    permissionGroups: any[] = [];
    permissionGroup!: any;

    constructor(
        private fb: FormBuilder,
        private configService: ConfigService,
        private settingService: SettingService,
        private activeRoute: ActivatedRoute,
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
            description: [null],
        });

        this.configService.getPermissions().forEach((group: any) => {
            this.permissionGroups.push(
                {
                    name: group.name,
                    completed: false,
                    color: 'primary',
                    disabled: false,
                    subCheckboxs: group.permissions.map((p: any) => {
                        return { id: p.id, disabled: false, name: `${p.name} (${p.id})`, completed: false, color: 'primary' }
                    })
                }
            );
        });

    };

    save() {
        let data: any = {
            Name: this.form.get('name')?.value,
            Code: this.form.get('code')?.value,
            Description: this.form.get('description')?.value,
            Permissions: this.permissionGroups.map((g: any) => g.subCheckboxs).flat(1).filter((p: any) => p.completed == true).map((c: any) => c.id).flat(1)
        };

        this.settingService.createPermissionGroup(data).subscribe(() => {
            this.alertService.showToastSuccess();
            this.router.navigateByUrl(`/setting/permission/groups`);
        })
    }

}