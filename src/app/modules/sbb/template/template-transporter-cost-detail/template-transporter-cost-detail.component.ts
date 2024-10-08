import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UpdateTemplateTransporterCostComponent } from '../update-template-transporter-cost/update-template-transporter-cost.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template-transporter-cost-detail',
  templateUrl: './template-transporter-cost-detail.component.html',
})

export class TemplateTransporterCostDetailComponent implements OnInit, AfterViewInit {
  category: any = [];
  name!: string;
  code!: string;
  settingDataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['numbericalOrder', 'category', 'cost', 'description']

  constructor(
    private dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<TemplateTransporterCostDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.settingDataSource.data = this.data.settings.categoryCosts;
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

    const dialogRef = this.dialog.open(UpdateTemplateTransporterCostComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigateByUrl("/sbb/templates/transporter-costs").then(() => { window.location.reload() })
    });

    this.dialogRef.close();
  }

}