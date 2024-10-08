import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { ShopService } from 'src/app/services/shop.service';
import { ConfigService } from 'src/app/shared/config.service';

@Component({
    selector: 'app-create-shop',
    templateUrl: './create-shop.component.html',
    styleUrls: ['./create-shop.component.css']
})

export class CreateShopComponent implements OnInit {
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
    defaultPassword = '88888888';
    wardId!: any;
    username: any = '';
    textMoney: any = '';
    avartars: any = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private fb: FormBuilder,
        private shopService: ShopService,
        private alertService: AlertService,
        private configService: ConfigService,
        private router: Router,
    ) {
    };

    ngAfterViewInit(): void {
    };

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [null, Validators.required],
            phoneNumber: [null, Validators.required],
            email: [null],
            description: [null],
            autoApprove: ["false", Validators.required],
            isActivated: ["true", Validators.required],
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
            Password: this.defaultPassword,
            Country: this.form.get("country")?.value,
            SlideUrls: this.images,
            UserName: this.username,
            Address: this.form.get("address")?.value,
            WardId: this.wardId,
            Avartar: this.avartars[0]
        };

        this.shopService.createShop(data)
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
        if (event) {
            this.images = this.images.concat(event);
            
            this.images.forEach((image: any) => {
                image = image + (new Date()).getTime();
            });
        }
    }

    locationSelected(event: any) {
        this.wardId = event.wardId;
    }

}