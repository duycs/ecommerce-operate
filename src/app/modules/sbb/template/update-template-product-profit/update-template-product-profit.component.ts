import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from 'src/app/shared/config.service';
import { TemplateService } from 'src/app/services/template.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-update-template-product-profit',
  templateUrl: './update-template-product-profit.component.html',
})

export class UpdateTemplateProductProfitComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  settingDataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['numbericalOrder', 'fromPrice', 'toPrice', 'profit', 'action']
  profitTypes: any[] = [{ name: '%', id: 1 }, { name: 'tiền mặt', id: 2 }];
  profitType!: any;

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private alertService: AlertService,
    private templateService: TemplateService,
    public dialogRef: MatDialogRef<UpdateTemplateProductProfitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngAfterViewInit(): void {
  }


  ngOnInit(): void {
    let settings = this.data.settings;

    console.log(settings);

    this.form = this.fb.group({
      name: [this.data.name, Validators.required],
      code: [this.data.code, Validators.required],
      description: [this.data.description],
      profitType: [settings.profitType, Validators.required],
      settings: this.fb.array([])
    });

    this.form.setControl('settings', this.templateService.getTemplateProductProfitAsFormArray(settings));
    this.settingDataSource.data = this.settings.controls;
  }

  get settings(): FormArray {
    return this.form.get('settings') as FormArray;
  }

  changeToPrice(event: any, index: any, element: any) {
    let displayValue = this.configService.getCurrencyDisplay(event.target.value);
    console.log(displayValue);

    if (this.getLastToPrice()) {
      this.settings.push(this.createSetting(this.getLastToPrice(), this.configService.getNewUid()));
      this.settingDataSource.data = this.settings.controls;
    } else {
      this.settings.controls[index + 1]?.get('fromPrice')?.setValue(event.target.value);
    }
  }

  updateFromPriceDisplay(event: any, element: any) {
    let displayValue = this.configService.getCurrencyDisplay(event.target.value);
  }

  createSetting(newFromPrice: any, id: any): FormGroup {
    return new FormGroup({
      id: new FormControl(id),
      fromPrice: new FormControl(~~newFromPrice ?? 0),
      toPrice: new FormControl(),
      profit: new FormControl(),
      currency: new FormControl('VND')
    })
  }

  selectedProfitType(event: any) {
    this.profitType = event.value;
  }

  okClick(): void {

    let settings: any = this.getValidSettings();

    if (!settings) {
      console.log('invalid');
      return;
    }

    let data = {
      id: this.data.id,
      code: this.form.get("code")?.value,
      name: this.form.get("name")?.value,
      description: this.form.get("description")?.value,
      settings: {
        profitType: this.form.get('profitType')?.value,
        profitRanges: settings
      },
    };

    this.templateService.createTeamplates([data])
      .subscribe(() => {
        this.alertService.showToastSuccess();
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });


    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  remove(element: any, index: any) {
    this.settings.controls = this.settings.controls.filter((s: any) => s.value.id !== element.value.id);
    this.settingDataSource.data = this.settings.controls;

    this.settings.controls[0]?.get('fromPrice')?.setValue(null);
    this.settings.controls[this.settings.controls.length - 1]?.get('toPrice')?.setValue(null);
  }
  addSetting() {
    let newFromPrice = this.getLastToPrice();
    if (newFromPrice || this.settings.controls.length == 0) {
      this.settings.push(this.createSetting(newFromPrice, this.configService.getNewUid()));
    } else {
      this.alertService.showToastMessage("Cần nhập giá tới hạn");
    }
    this.settingDataSource.data = this.settings.controls;
  }

  getLastToPrice() {
    return this.settings.controls.map(c => c.value).slice(-1)[0].toPrice;
  }

  getValidSettings() {

    // validate price
    let inValid = false;
    let inValidPrice = false;
    let length = this.settings.controls.length;
    let inValidMessages: any = [];


    if (!this.form.get('name')?.value || this.form.get('name')?.value === '') {
      inValidMessages.push("Cần nhập tên");
      inValid = true;
    }

    if (!this.form.get('code')?.value || this.form.get('code')?.value === '') {
      inValidMessages.push("Cần nhập mã");
      inValid = true;
    }

    for (let i = 0; i < this.settings.controls.length; ++i) {
      let invalidRows = [];

      if (i == 0 && (!this.settings.controls[i].get('toPrice')?.value || this.settings.controls[i].get('toPrice')?.value <= 0)) {
        inValidMessages.push(`Khoảng giá thứ ${i + 1} giá Đến không hợp lệ`);
        inValidPrice = true;
      }

      if (i < length - 1 && i > 0 && this.settings.controls[i].get('toPrice')?.value <= this.settings.controls[i - 1].get('toPrice')?.value) {
        inValidMessages.push(`Khoảng giá thứ ${i + 1} so với khoảng giá thứ ${i} đang không hợp lệ`);
        inValidPrice = true;
        invalidRows.push(i);
        invalidRows.push(i + 1);
      }

      if (i < length - 2 && i > 0 && this.settings.controls[i + 1].get('toPrice')?.value <= this.settings.controls[i].get('toPrice')?.value) {
        if (!(invalidRows.includes(i) && invalidRows.includes(i + 1))) {
          inValidMessages.push(`Khoảng giá thứ ${i + 1} so với khoảng giá thứ ${i + 2} đang không hợp lệ`);
        }

        inValidPrice = true;
      }

      if (!this.settings.controls[i]?.get('profit')?.value || this.settings.controls[i]?.get('profit')?.value === 0) {
        inValidMessages.push(`Khoảng giá thứ ${i + 1} đang có lợi nhuận không hợp lệ, lợi nhuận cần lớn hơn 0`);
        inValid = true;
      }
    }

    if (inValidPrice) {
      inValidMessages.push("Cần nhập giá Đến trong khoảng sau lớn hơn giá Đến trong khoảng trước");
    }

    if (inValidPrice || inValid) {
      this.alertService.showToastMessage(inValidMessages.join(". "));
      return;
    }

    // reset last toPrice
    for (let i = 0; i < this.settings.controls.length; ++i) {
      if (this.settings.controls[i]?.get('fromPrice')?.value) {
        this.settings.controls[i]?.get('fromPrice')?.setValue(~~this.settings.controls[i]?.get('fromPrice')?.value);
      }
      if (this.settings.controls[i]?.get('toPrice')?.value) {
        this.settings.controls[i]?.get('toPrice')?.setValue(~~this.settings.controls[i]?.get('toPrice')?.value);
      }
      if (this.settings.controls[i]?.get('profit')?.value) {
        this.settings.controls[i]?.get('profit')?.setValue(~~this.settings.controls[i]?.get('profit')?.value);
      }
    }
    this.settings.controls[this.settings.controls.length - 1].get('toPrice')?.setValue(null);

    let settings = this.settings.controls.map((c: any) => c.value);

    return settings;
  }

}