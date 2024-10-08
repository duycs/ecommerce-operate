import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { PhotoService } from 'src/app/services/photo.service';
import { ShopService } from 'src/app/services/shop.service';
import { TransporterService } from 'src/app/services/transporter.service';
import { ConfigService } from 'src/app/shared/config.service';
import { UploadType } from 'src/app/shared/models/uploadType';

@Component({
    selector: 'app-create-transporter',
    templateUrl: './create-transporter.component.html',
    styleUrls: ['./create-transporter.component.css']
})

export class CreateTransporterComponent implements OnInit {
    form!: FormGroup;
    countries: any[] = [
        { id: 1, name: "Việt Nam", code: "VN" },
        { id: 2, name: "Trung Quốc", code: "CN" },
    ];
    currencies: any[] = [
        { code: "VND" },
        { code: "CNY" },
    ];
    isEditableNew: boolean = true;
    images: any[] = [];
    avatars: any[] = [];
    defaultPassword = '88888888';
    shops: any = [];
    shopSelected: any = [];
    wardId!: any;
    textMoney: any = '';
    transporter: any = [];
    name: any = '';
    code: any = '';
    phoneNumber: string = '';
    email: string = '';

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private fb: FormBuilder,
        private router: Router,
        private transporterService: TransporterService,
        private photoService: PhotoService,
        private shopService: ShopService,
        private alertService: AlertService,
        private configService: ConfigService,
    ) {
    };

    ngAfterViewInit(): void {
        this.getShopsByName();
    };

    ngOnInit(): void {
        this.form = this.fb.group({
            description: [null],
            isAcivated: ["true", Validators.required],
            country: ["VN", Validators.required],
            address: [null, Validators.required],
            currency: ["VND", Validators.required],
            debtLimit: [0, Validators.required]
        });

        this.form.get("debtLimit")?.valueChanges.subscribe(value => {
            this.textMoney = `(${this.configService.getCurrencyInVietnamWord(value)})`;
        });

        this.getTransporter();

    };

    pressChangePhone(event: any) {
        this.phoneNumber = event.target.value;
    }

    getShopsByName(name: string = '') {
        let queryParams: any = {};

        if (name && name !== '') {
            queryParams.name = name;
        }

        let shopSelectedIds = this.shopSelected?.map((s: any) => s.id) ?? [];
        this.shopService.getShops(queryParams, 0, 10000).subscribe((pageData) => {
            if (pageData.data && pageData.data.length > 0) {
                this.shops = pageData.data.filter((c: any) => !shopSelectedIds.includes(c.id));
            }
        });
    }

    getTransporter(field: string = '', value: string = '') {
        let queryParams: any = {};
        if (field === 'name') {
            queryParams.name = value;
        }

        if (field === 'code') {
            queryParams.code = value;
        }

        this.transporterService.getTransporters(queryParams, 0, 1000)
            .subscribe((res: any) => {
                this.transporter = res;
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    outputCode(event: any) {
        this.code = event.value;
        this.getTransporter("code", this.code);
    }

    outputName(event: any) {
        this.name = event.value;
        this.getTransporter("name", this.name);
    }

    outputPhoneNumber(event: any) {
        this.phoneNumber = event.value;
        this.getTransporter("phoneNumber", this.phoneNumber);
    }

    outputEmail(event: any) {
        this.email = event.value;
        this.getTransporter("email", this.email);
    }

    save() {
        let shopIds = this.shopSelected.map((s: any) => s.id);

        let data = {
            code: this.code,
            name: this.name,
            phoneNumber: this.phoneNumber,
            email: this.email,
            description: this.form.get("description")?.value,
            isAcivated: this.form.get("isAcivated")?.value,
            country: this.form.get("country")?.value,
            address: this.form.get("address")?.value,
            wardId: this.wardId,
            currency: this.form.get('currency')?.value,
            debtLimit: this.form.get("debtLimit")?.value,
            shopIds: shopIds,
            avatar: this.avatars[0]
        };

        this.transporterService.createOrUpdateTransporter(data)
            .subscribe(() => {
                this.alertService.showToastSuccess();
                this.router.navigateByUrl('sbb/transporters');
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    getImages() {
        this.images = [];
        this.photoService.getPhotos(UploadType.PRODUCT_IMAGE)
            .subscribe({
                next: (res) => {
                    if (!Array.isArray(res)) {
                        return;
                    };

                    this.images = res;
                },
                error: (err: HttpErrorResponse) => {
                    this.alertService.showToastError();
                    console.log(err);
                }
            });
    }

    deleteAllImages = () => {
        let fileUrls = this.images.map((p: any) => {
            return p.src;
        });

        if (fileUrls.length > 0) {
            this.photoService.removePhotos(fileUrls).subscribe((data: any) => {
                this.getImages();
            });
        }
    }

    uploadImageFinished(event: any) {
        if (event) {
            this.getImages();
        }
    }

    onSelectShop(event: any) {
        this.shopSelected = event.selectedOptions.map((c: any) => {
            return {
                id: c.id, name: c.value.name
            }
        });
        let name = event.searchValue;
        this.getShopsByName(name);
    }

    locationSelected(event: any) {
        this.wardId = event.wardId;
    }

    uploadAvatarImageFinished(event: any) {
        if (event) {
            this.avatars = this.avatars.concat(event);
            this.avatars.forEach((image: any) => {
                image = image + (new Date()).getTime();
            });
        }
    }

}