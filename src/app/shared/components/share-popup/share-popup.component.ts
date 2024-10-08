import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as htmlToImage from 'html-to-image';
const download = require("downloadjs");

@Component({
    selector: 'app-share-popup',
    templateUrl: './share-popup.component.html',
})

export class SharePopupComponent implements OnInit {

    @ViewChild('image') imageElm!: ElementRef;

    constructor(
        public dialogRef: MatDialogRef<SharePopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
    }

    copy(): void {
        setTimeout(() => {
            this.dialogRef.close();
        }, 500)
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