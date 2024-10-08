import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as htmlToImage from 'html-to-image';
import { CreateShopPaidDebtComponent } from 'src/app/modules/sbb/shop/create-shop-paid-debt/create-shop-paid-debt.component';
import { AlertService } from 'src/app/services/alert.service';
import { PhotoService } from 'src/app/services/photo.service';
import { environment } from 'src/environments/environment';
const download = require("downloadjs");

@Component({
    selector: 'app-send-popup',
    templateUrl: './send-popup.component.html',
})

export class SendPopupComponent implements OnInit, AfterViewInit {
    messageValidate = '';
    message!: any;
    progress = 0;
    imageWidth = 'auto';
    imageHeight = '350px';

    url!: any;

    constructor(
        private dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private photoService: PhotoService,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<SendPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngAfterViewInit(): void {
        let files = this.data.files;
        for (let i = 0; i < files.length; i++) {
            this.readURL(files[i]);
        }

        if (this.data.screen == 'mobile') {
            this.imageWidth = '250px';
            this.imageHeight = 'auto';
        }
    }

    ngOnInit(): void {
        console.log(this.data);
    }

    readURL(file: any) {
        if (file) {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                console.log(event);
                this.url = event.target.result;
            }
            reader.readAsDataURL(file);
        }
    }

    close() {
        this.dialogRef.close();
    }

    send() {
        let files = this.data.files;
        this.progress = 10;
        this.messageValidate = "";

        const fileList = new Array<File>();
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append(files.item(i).name + (new Date().getTime()), files.item(i));
            fileList.push(files.item(i));
        }

        let headers = new Headers();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        let options = { reportProgress: true, observe: 'events', headers: headers };

        this.photoService.uploadPhoto(formData, options)
            .subscribe({
                next: (event: any) => {
                    console.log("upload photos:", event);

                    if (event && event.type === HttpEventType.UploadProgress) {
                        this.progress = Math.round(100 * event.loaded / event.total);
                    }
                    else if (event.type === HttpEventType.Response) {

                        let data = {
                            urls: event.body,
                            message: this.message
                        };

                        let result = { success: true, messageValidate: this.messageValidate, data: data }; //set data.
                        this.dialogRef.close(result);

                        this.dialogRef.afterClosed().subscribe(result => {
                            if (result.success) {
                                //this.alertService.showToastSuccess();
                            }
                        });
                    }
                },
                error: (err: HttpErrorResponse) => {
                    console.log(err);
                    this.messageValidate = "upload error";
                }
            });
    }

}