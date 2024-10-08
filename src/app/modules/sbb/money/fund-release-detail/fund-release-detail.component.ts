import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigService } from 'src/app/shared/config.service';

@Component({
  selector: 'app-fund-release-detail',
  templateUrl: './fund-release-detail.component.html',
})

export class FundReleaseDetailComponent implements OnInit {
  form!: FormGroup;
  textMoney: string = '';

  constructor(
    private configService: ConfigService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FundReleaseDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.textMoney = this.configService.getCurrencyInVietnamWord(this.data.totalMoney);
  }

  okClick(): void {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  print(){

  }

}