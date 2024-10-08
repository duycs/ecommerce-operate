import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationService } from './navigation.service';
@Injectable({
    providedIn: 'root'
})
export class PrintService {

    isPrinting = false;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private navigationService: NavigationService) {
    }

    printMoneyCollect(id: any) {
        this.isPrinting = true;
        let newRelativeUrl = this.router.createUrlTree(
            ['/',
                {
                    outlets: {
                        'print': ['print', 'money-collect', id],
                    }
                }
            ],
            {
                queryParams: { brand: 'SÀN BÁN BUÔN', title: 'Mẫu số: 01-TT' }
            });

        let baseUrl = window.location.href.replace(this.router.url, '');
        window.open(baseUrl + newRelativeUrl, '_blank');
    }

    printMoneyPay(id: any) {
        this.isPrinting = true;
        let newRelativeUrl = this.router.createUrlTree(
            ['/',
                {
                    outlets: {
                        'print': ['print', 'money-pay', id],
                    }
                }
            ],
            {
                queryParams: { brand: 'SÀN BÁN BUÔN', title: 'Mẫu số: 01-TT' }
            });

        let baseUrl = window.location.href.replace(this.router.url, '');
        window.open(baseUrl + newRelativeUrl, '_blank');
    }

    // in phiếu nhặt hàng
    printOrderCollect(id: any) {
        this.isPrinting = true;
        let newRelativeUrl = this.router.createUrlTree(
            ['/',
                {
                    outlets: {
                        'print': ['print', 'order-collect', id],
                    }
                }
            ],
            {
                queryParams: { showHeader: false }
            });

        let baseUrl = window.location.href.replace(this.router.url, '');
        window.open(baseUrl + newRelativeUrl, '_blank');
    }


    // in đơn hàng cho khách
    printOrder(id: any) {
        this.isPrinting = true;
        let newRelativeUrl = this.router.createUrlTree(
            ['/',
                {
                    outlets: {
                        'print': ['print', 'order', id],
                    }
                }
            ],
            {
                queryParams: { brand: 'SÀN BÁN BUÔN', title: 'GIẤY BÁO GIÁ' }
            });

        let baseUrl = window.location.href.replace(this.router.url, '');
        window.open(baseUrl + newRelativeUrl, '_blank');
    }

    // in đơn hàng con
    printOrderSub(id: any) {
        this.isPrinting = true;
        let newRelativeUrl = this.router.createUrlTree(
            ['/',
                {
                    outlets: {
                        'print': ['print', 'order-sub', id],
                    }
                }
            ],
            {
                queryParams: { brand: 'SÀN BÁN BUÔN', title: 'GIẤY BÁO GIÁ' }
            });

        let baseUrl = window.location.href.replace(this.router.url, '');
        window.open(baseUrl + newRelativeUrl, '_blank');
    }

    // in đơn giao cho khách
    printOrderDeliver(id: any) {
        this.isPrinting = true;
        let newRelativeUrl = this.router.createUrlTree(
            ['/',
                {
                    outlets: {
                        'print': ['print', 'order-deliver', id],
                    }
                }
            ],
            {
                queryParams: { brand: 'SÀN BÁN BUÔN', title: 'HÓA ĐƠN GIAO HÀNG' }
            });

        let baseUrl = window.location.href.replace(this.router.url, '');
        window.open(baseUrl + newRelativeUrl, '_blank');
    }

    onDataReady() {
        setTimeout(() => {
            window.print();
            this.isPrinting = false;
            console.debug(['onDataReady isPrinting', this.isPrinting, 'is null']);
            this.router.navigate([{ outlets: { print: null } }]);
        });
    }
}
