import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as htmlToImage from 'html-to-image';
const download = require("downloadjs");

@Component({
    selector: 'app-download-image-popup',
    templateUrl: './download-image-popup.component.html',
})

export class DownloadImagePopupComponent implements OnInit {

    @ViewChild('image') imageElm!: ElementRef;

    constructor(
        public dialogRef: MatDialogRef<DownloadImagePopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
        console.log(this.data);
    }

    close() {
        this.dialogRef.close();
    }

    downloadImage() {
        htmlToImage.toPng(this.imageElm.nativeElement)
            .then(function (dataUrl) {
                download(dataUrl, 'orders.png');
            });
    }

}