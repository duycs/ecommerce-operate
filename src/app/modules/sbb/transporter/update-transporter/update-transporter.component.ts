import { query } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { PhotoService } from 'src/app/services/photo.service';
import { ShopService } from 'src/app/services/shop.service';
import { TransporterService } from 'src/app/services/transporter.service';
import { ConfigService } from 'src/app/shared/config.service';
import { UploadType } from 'src/app/shared/models/uploadType';

@Component({
    selector: 'app-update-transporter',
    templateUrl: './update-transporter.component.html',
    styleUrls: ['./update-transporter.component.css']
})

export class UpdateTransporterComponent implements OnInit {
    form!: FormGroup;
    id!: any;
    transporter!: any;
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
    shops: any = [];
    shopSelected: any = [];
    wardId!: any;
    textMoney: any = '';
    name: any = '';
    code: any = '';
    phoneNumber: string = '';
    email: string = '';

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private fb: FormBuilder,
        private router: Router,
        private activeRoute: ActivatedRoute,
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
            name: [null, Validators.required],
            code: [null, Validators.required],
            email: [null, Validators.required],
            phoneNumber: [null, Validators.required],
            description: [null],
            isAcivated: [null, Validators.required],
            country: [null, Validators.required],
            address: [null, Validators.required],
            currency: [null, Validators.required],
            debtLimit: [null, Validators.required],
        });

        this.getTransporterThenInitForm();

        this.form.get("debtLimit")?.valueChanges.subscribe(value => {
            this.textMoney = `(${this.configService.getCurrencyInVietnamWord(value)})`;
        });
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

    getTransporterThenInitForm() {
        this.id = this.activeRoute.snapshot.params['id'];
        this.transporterService.getTransporter(this.id)
            .subscribe((res: any) => {
                this.transporter = res;
                this.form.get("name")?.setValue(this.transporter.name);
                this.form.get("code")?.setValue(this.transporter.code);
                this.form.get("email")?.setValue(this.transporter.email);
                this.form.get("phoneNumber")?.setValue(this.transporter.phoneNumber);
                this.form.get("description")?.setValue(this.transporter.description);
                this.form.get("isAcivated")?.setValue(this.transporter.isAcivated + "");
                this.form.get("country")?.setValue(this.transporter.country);
                this.form.get("currency")?.setValue(this.transporter.currency);
                this.form.get("debtLimit")?.setValue(this.transporter.debtLimit);
                this.form.get("address")?.setValue(this.transporter.address);
                this.avatars = [this.transporter?.avatar];

                let shops = this.transporter.transporterShops.map((c: any) => { return { name: c.shopName, id: c.shopId } });
                this.transporter.shops = shops;
                this.shopSelected = shops;

            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    save() {
        let shopIds = this.shopSelected.map((s: any) => s.id);

        let data = {
            id: this.transporter.id,
            code: this.form.get("code")?.value,
            name: this.form.get("name")?.value,
            phoneNumber: this.form.get("phoneNumber")?.value,
            email: this.form.get("email")?.value,
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
        console.log(event);
        this.shopSelected = event.selectedOptions.map((c: any) => {
            return {
                id: c.id, name: c.name
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