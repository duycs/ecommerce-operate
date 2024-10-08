import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { PhotoService } from 'src/app/services/photo.service';
import { ShopService } from 'src/app/services/shop.service';
import { ConfigService } from 'src/app/shared/config.service';
import { UploadType } from 'src/app/shared/models/uploadType';

@Component({
    selector: 'app-update-shop',
    templateUrl: './update-shop.component.html',
    styleUrls: ['./update-shop.component.css']
})

export class UpdateShopComponent implements OnInit {
    id!: any;
    shop!: any;
    form!: FormGroup;
    countries: any[] = [
        { id: 1, name: "Việt Nam", code: "VN" },
        { id: 2, name: "Trung Quốc", code: "CN" },
    ];
    currencies: any[] = [
        { code: "VND" },
        { code: "CNY" },
    ];
    phoneNumber: string = '';
    isEditableNew: boolean = true;
    images: any[] = [];
    avartars: any[] = [];
    defaultPassword = '88888888';
    wardId!: any;
    username: any = '';
    textMoney: any = '';

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private fb: FormBuilder,
        private activeRoute: ActivatedRoute,
        private router: Router,
        private shopService: ShopService,
        private photoService: PhotoService,
        private alertService: AlertService,
        private configService: ConfigService,
    ) {
    };

    ngAfterViewInit(): void {
        this.getShopThenInitForm();
    };

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [null, Validators.required],
            phoneNumber: [null, Validators.required],
            email: [null],
            description: [null],
            autoApprove: ["false", Validators.required],
            isActivated: ["1", Validators.required],
            country: ["VN", Validators.required],
            address: [null, Validators.required],
            currency: [null, Validators.required],
            debtLimit: [null, Validators.required]
        });

        this.form.controls['name'].valueChanges.subscribe((value: any) => {
            this.username = this.configService.nameToCode(value);
        });

        this.form.get("debtLimit")?.valueChanges.subscribe(value => {
            this.textMoney = `(${this.configService.getCurrencyInVietnamWord(value)})`;
        });
    };

    getShopThenInitForm() {
        this.id = this.activeRoute.snapshot.params['id'];
        this.shopService.getShop(this.id)
            .subscribe((res: any) => {
                console.log(res);

                if (res) {
                    this.shop = res;
                    this.form.get("name")?.setValue(this.shop.name);
                    this.form.get("code")?.setValue(this.shop.code);
                    this.form.get("email")?.setValue(this.shop.email);
                    this.form.get("phoneNumber")?.setValue(this.shop.phoneNumber);
                    this.form.get("description")?.setValue(this.shop.description);
                    this.form.get("autoApprove")?.setValue(this.shop.autoApprove + "");
                    this.form.get("isActivated")?.setValue(this.shop.isActived + "");
                    this.form.get("country")?.setValue(this.shop.country);
                    this.form.get("currency")?.setValue(this.shop?.currency ?? 'VND');
                    this.form.get("debtLimit")?.setValue(this.shop?.debtLimit ?? 0);
                    this.form.get("address")?.setValue(this.shop.address);
                    this.images = this.shop?.slideUrls ?? [];
                    this.avartars = [this.shop?.avatar];
                }
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    pressChangePhone(event: any) {
        this.phoneNumber = event.target.value;
    }

    save() {
        let data = {
            Name: this.form.get("name")?.value,
            PhoneNumber: this.form.get("phoneNumber")?.value,
            Email: this.form.get("email")?.value,
            Description: this.form.get("description")?.value,
            AutoApprove: this.form.get("autoApprove")?.value === "true" ? true : false,
            IsActivated: this.form.get("isActivated")?.value,
            //Password: this.defaultPassword,
            Country: this.form.get("country")?.value,
            SlideUrls: this.images,
            //UserName: this.username,
            Address: this.form.get("address")?.value,
            WardId: this.wardId,
            Avartar: this.avartars[0]
        };

        this.shopService.updateShop(this.id, data)
            .subscribe(() => {
                this.alertService.showToastSuccess();
                this.router.navigateByUrl("/sbb/shops");
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    uploadAvartarImageFinished(event: any) {
        if (event) {
            this.avartars = this.avartars.concat(event);
            this.avartars.forEach((image: any) => {
                image = image + (new Date()).getTime();
            });
        }
    }

    uploadImageFinished(event: any) {
        console.log(event);

        if (event) {
            this.images = this.images.concat(event);
            this.images.forEach((image: any) => {
                image = image + (new Date()).getTime();
            });

            console.log("images", this.images);
        }
    }

    locationSelected(event: any) {
        this.wardId = event.wardId;
    }
}