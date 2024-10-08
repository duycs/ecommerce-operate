import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { PrintService } from 'src/app/services/print.service';
import { DOCUMENT } from '@angular/common';
import { SharePopupComponent } from 'src/app/shared/components/share-popup/share-popup.component';

declare var require: any;
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

import * as htmlToImage from 'html-to-image';
import { DownloadImagePopupComponent } from '../download-image-popup/download-image-popup.component';
const download = require("downloadjs");

@Component({
  selector: 'app-order-deliver-for-customer',
  templateUrl: './order-deliver-for-customer.component.html',
})

export class OrderDeliverForCustomerComponent implements OnInit {
  //orders!: any[];

  orders: any = [
    {
      customerId: 1234,
      customerName: 'Mr Vọng',
      customerPhone: '0868606683',
      checked: true,
      orderDelivers: [
        {
          code: 'CD231114EKB42I',
          customerOrderCode: 'abcd',
          id: 'b26737b4-1085-4684-8bae-ccf02f29adb7',
          createdDate: new Date(),
          checked: true
        },
        {
          code: 'CD231110GAH19I',
          customerOrderCode: 'ghj',
          id: '5146fb06-0177-40f1-8512-8accdebe8c8e',
          createdDate: new Date(),
          checked: true
        }
      ]
    },
    {
      customerId: 23456,
      customerName: 'Nguyễn Văn A',
      customerPhone: '0349020269',
      checked: true,
      orderDelivers: [
        {
          code: 'CD231110TPSYZP',
          customerOrderCode: 'xyz',
          id: '63cdd617-9e79-4aee-9b9a-49a53bf8fd04',
          createdDate: new Date(),
          checked: true
        }
      ]
    }
  ];

  checkedOrders: any[] = [];

  @ViewChild('image') imageElm!: ElementRef;

  @ViewChild('pdfContent') pdfTable!: ElementRef;

  constructor(
    private alertService: AlertService,
    private printService: PrintService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<OrderDeliverForCustomerComponent>,
    @Inject(DOCUMENT) private document: any,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    if (this.data && this.data.length > 0) {
      this.orders = this.data;
    }

    console.log("OrderDeliverForCustomerComponent", this.data);
  }

  checkOrdeDeliver(orderDeliver: any) {
    orderDeliver.checked = !orderDeliver.checked;

    this.orders.forEach((o: any) => {
      if (o.orderDelivers.find((c: any) => c.code === orderDeliver.code)) {
        if (o.orderDelivers.filter((c: any) => c.checked).length === o.orderDelivers.length)
          o.checked = true;
        else
          o.checked = false
      }
    });
  }

  checkAll(order: any) {
    order.checked = !order.checked;

    this.orders.forEach((o: any) => {
      if (o.code === order.code) {
        if (order.checked) {
          order.orderDelivers.forEach((c: any) => {
            c.checked = true;
          });
        } else {
          order.orderDelivers.forEach((c: any) => {
            c.checked = false;
          });
        }
      }
    });

  }

  share(): void {
    this.checkedOrders = this.orders.map((o: any) => o.orderDelivers).flat(1).filter((o: any) => o.checked);

    let links = [];
    if (this.checkedOrders && this.checkedOrders.length > 0) {
      for (let i = 0; i < this.checkedOrders.length; ++i) {
        links.push(`${this.document.location.hostname}/sbb/order-delivers/${this.checkedOrders[i].id}`);
      }
    }

    console.log("share links", links);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { type: 'shareLink', title: "Chia sẻ đơn giao hàng cho khách", list: links };
    //dialogConfig.width = '50vw';

    const dialogRef = this.dialog.open(SharePopupComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
    });

    //this.dialogRef.close();
  }

  print(): void {
    this.checkedOrders = this.orders.map((o: any) => o.orderDelivers).flat(1).filter((o: any) => o.checked);

    if (this.checkedOrders && this.checkedOrders.length > 0) {
      for (let i = 0; i < this.checkedOrders.length; ++i) {
        this.printService.printOrderDeliver(this.checkedOrders[i].id);
      }
    }

    //this.dialogRef.close();
  }

  // download(): void {
  //   this.downloadAsPDF();
  //   //this.dialogRef.close();
  // }

  close() {
    this.dialogRef.close();
  }

  public downloadAsPDF() {
    const pdfElement = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfElement.innerHTML);
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download();
  }

  downloadImageOrders() {
    this.checkedOrders = this.orders.map((o: any) => o.orderDelivers).flat(1).filter((o: any) => o.checked);

    setTimeout(() => {
      this.checkedOrders = this.orders.map((o: any) => o.orderDelivers).flat(1).filter((o: any) => o.checked);
      let orderIds = this.checkedOrders.map((c: any) => c.id).flat(1);

      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      // dialogConfig.width = '20wh';
      dialogConfig.data = { type: 'image-print-orders', list: orderIds}

      const dialogRef = this.dialog.open(DownloadImagePopupComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(() => {
      });
    }, 2000);
  }

  downloadImage() {
    this.checkedOrders = this.orders.map((o: any) => o.orderDelivers).flat(1).filter((o: any) => o.checked);

    console.log(this.imageElm.nativeElement.innerHTML);

    setTimeout(() => {
      htmlToImage.toPng(this.imageElm.nativeElement)
        .then(function (dataUrl) {
          download(dataUrl, 'orders.png');
        });
    }, 2000);

  }

}