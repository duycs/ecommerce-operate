import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { SettingService } from 'src/app/services/setting.service';
import { ConfigService } from 'src/app/shared/config.service';

const ELEMENT_DATA: any[] = [
    { numbericalOrder: 1, name: 'Duy', phone: '0914376766', currentDebtLimit: 200000, debtLimit: 10000, note: 'abcd' },
];

@Component({
    selector: 'app-permission-detail',
    templateUrl: './permission-detail.component.html',
    styleUrls: []
})

export class PermissionDetailComponent implements OnInit {
    form!: FormGroup;
    price!: number;
    upPrice!: number;
    note!: number;
    id!: string;
    permissionGroups: any[] = [];
    permissions: any = {
        productPermissionCheckbox: {
            name: 'Sản phẩm',
            completed: false,
            color: 'primary',
            disabled: true,
            subCheckboxs: [
                { id: 1, disabled: true, name: 'xem', completed: true, color: 'primary' },
                { id: 2, disabled: true, name: 'sửa', completed: true, color: 'primary' },
                { id: 3, disabled: true, name: 'xóa', completed: false, color: 'primary' },
            ],
        },
        orderPermission: {
            name: 'Đơn hàng',
            completed: false,
            color: 'primary',
            disabled: true,
            subCheckboxs: [
                { id: 1, disabled: true, name: 'xem', completed: true, color: 'primary' },
                { id: 2, disabled: true, name: 'phê duyệt đặt hàng NCC', completed: false, color: 'primary' },
                { id: 3, disabled: true, name: 'hủy đơn', completed: false, color: 'primary' },
            ],
        },
        deliverPermission: {
            name: 'Đơn giao cho khách',
            completed: false,
            color: 'primary',
            disabled: true,
            subCheckboxs: [
                { id: 1, disabled: true, name: 'xem', completed: false, color: 'primary' },
                { id: 2, disabled: true, name: 'tạo đơn giao hàng cho khách', completed: false, color: 'primary' },
            ],
        },
    };

    permissionGroup!: any;

    constructor(
        private router: Router,
        private configService: ConfigService,
        private settingService: SettingService,
        private activeRoute: ActivatedRoute,
        private alertService: AlertService,
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
                            name: `${group.name} (${group.id})` ,
                            completed: false,
                            color: 'primary',
                            disabled: true,
                            subCheckboxs: group.permissions.map((p: any) => {
                                return { id: p.id, disabled: true, name: `${p.name} (${p.id})`, completed: this.permissionGroup.permissions.includes(p.id), color: 'primary' }
                            })
                        }
                    );
                });

                console.log(this.permissionGroups);
            }
        })
    };

    edit() {
        this.router.navigateByUrl(`/setting/permission/groups/${this.id}/edit`);
    }

}