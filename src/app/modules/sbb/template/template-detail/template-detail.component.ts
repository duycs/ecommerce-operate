import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UpdateTemplateTransporterCostComponent } from '../update-template-transporter-cost/update-template-transporter-cost.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UpdateTemplateProductProfitComponent } from '../update-template-product-profit/update-template-product-profit.component';

@Component({
  selector: 'app-template-detail',
  templateUrl: './template-detail.component.html',
})

export class TemplateDetailComponent implements OnInit, AfterViewInit {
  category: any = [];
  name!: string;
  code!: string;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<TemplateDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  okClick(): void {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  update() {
    switch (this.data.type) {
      case 1:
        this.dialog.open(UpdateTemplateProductProfitComponent, {
          data: this.data,
        }).afterClosed().subscribe(() => {
          setTimeout(() => {
            this.router.navigateByUrl("/sbb/templates").then(() => { window.location.reload() })

          }, environment.loadTimeout);
        });

        break;

      case 2:
        this.dialog.open(UpdateTemplateTransporterCostComponent, {
          data: this.data,
        }).afterClosed().subscribe(() => {
          setTimeout(() => {
            this.router.navigateByUrl("/sbb/templates").then(() => { window.location.reload() })

          }, environment.loadTimeout);
        });

        break;

      default:
        break;
    }

    this.dialogRef.close();
  }

}