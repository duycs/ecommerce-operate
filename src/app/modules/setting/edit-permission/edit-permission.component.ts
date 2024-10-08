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
    selector: 'app-edit-permission',
    templateUrl: './edit-permission.component.html',
    styleUrls: []
})

export class EditPermissionComponent implements OnInit {
    form!: FormGroup;
    id!: string;
    permissionGroups: any[] = [];
    permissionGroup!: any;

    constructor(private fb: FormBuilder,
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
        this.id = this.activeRoute.snapshot.params['id'];
        this.settingService.getPermissionGroups({ id: this.id }, 0, 1).subscribe((res: any) => {
            if (res) {
                this.permissionGroup = res[0];
                this.configService.getPermissions().forEach((group: any) => {
                    this.permissionGroups.push(
                        {
                            name: group.name,
                            completed: false,
                            color: 'primary',
                            disabled: false,
                            subCheckboxs: group.permissions.map((p: any) => {
                                return { id: p.id, disabled: false, name: `${p.name} (${p.id})`, completed: this.permissionGroup.permissions.includes(p.id), color: 'primary' }
                            })
                        }
                    );
                });


                this.form = this.fb.group({
                    name: [this.permissionGroup.name, Validators.required],
                    code: [this.permissionGroup.code, Validators.required],
                    description: [this.permissionGroup.description],
                });
            }
        })
    };

    save() {
        let data: any = {
            Name: this.form.get('name')?.value,
            Code: this.form.get('code')?.value,
            Description: this.form.get('description')?.value,
            Permissions: this.permissionGroups.map((g: any) => g.subCheckboxs).flat(1).filter((p: any) => p.completed == true).map((c: any) => c.id).flat(1)
        };

        

        this.settingService.updatePermissionGroup(this.id, data).subscribe(() => {
            this.alertService.showToastSuccess();
            this.router.navigateByUrl(`/setting/permission/groups/${this.id}`);
        })
    }

}