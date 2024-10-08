import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountantService } from 'src/app/services/accountant.service';
import { AlertService } from 'src/app/services/alert.service';
import { PrintService } from 'src/app/services/print.service';
import { ConfigService } from 'src/app/shared/config.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
  selector: 'app-print-money-pay',
  templateUrl: './print-money-pay.component.html',
  styleUrls: []
})
export class PrintMoneyPayComponent implements OnInit {

  current!: any;
  data: any;
  textMoney: any;
  id!: any;

  constructor(
    private activedRoute: ActivatedRoute,
    private printService: PrintService,
    private accountantService: AccountantService,
    private alertService: AlertService,
    private configService: ConfigService
  ) {
    this.id = this.activedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.current = new Date();
    this.getDataThenPrint();
  }

  getDataThenPrint() {
    this.accountantService.getLedger(this.id)
      .subscribe(res => {
        if (res) {
          this.data = res[0];
          this.textMoney = this.configService.getCurrencyInVietnamWord(this.data.totalMoney);
          this.printService.onDataReady();
        }
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

}