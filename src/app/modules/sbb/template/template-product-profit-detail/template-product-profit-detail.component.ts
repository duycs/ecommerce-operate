import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UpdateTemplateProductProfitComponent } from '../update-template-product-profit/update-template-product-profit.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template-product-profit-detail',
  templateUrl: './template-product-profit-detail.component.html',
})

export class TemplateProductProfitDetailComponent implements OnInit, AfterViewInit {
  id!: any;
  profitRangeDataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['numbericalOrder', 'fromPrice', 'toPrice', 'profit']
  settings: any = {};

  constructor(
    private dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<TemplateProductProfitDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngAfterViewInit(): void {
  }


  ngOnInit(): void {
    this.settings = this.data.settings;
    this.profitRangeDataSource.data =  this.data.settings.profitRanges;
  }

  okClick(): void {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  update() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.data;
    dialogConfig.width = '50vw';

    const dialogRef = this.dialog.open(UpdateTemplateProductProfitComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigateByUrl("/sbb/templates/product-profits").then(() => { window.location.reload() })
    });

    this.dialogRef.close();
  }

}