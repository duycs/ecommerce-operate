import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from 'src/app/shared/config.service';
import { TemplateService } from 'src/app/services/template.service';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-update-template-transporter-cost',
  templateUrl: './update-template-transporter-cost.component.html',
})

export class UpdateTemplateTransporterCostComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  category: any = [];
  name!: string;
  code!: string;
  suggestCode: string = '';
  suggestName: string = '';
  settingDataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['numbericalOrder', 'category', 'cost', 'description', 'action']

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private productService: ProductService,
    private alertService: AlertService,
    private templateService: TemplateService,
    public dialogRef: MatDialogRef<UpdateTemplateTransporterCostComponent>,
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
      settings: this.fb.array([])
    });

    this.initSettingsByCategory(settings);
  }

  initSettingsByCategory(settings: any) {
    let categoryIds: any = [];
    try {
      categoryIds = settings.categoryCosts.map((c: any) => c.categoryId);
    } catch {

    }

    this.productService.getProductCategories({}, 0, 1000).subscribe((res: any) => {
      if (res && res.data && res.data.length > 0) {
        let mixCategories = res.data.filter((c: any) => !categoryIds.includes(c.id))
          .map((c: any) => {
            return {
              categoryId: c.id,
              categoryName: c.name,
              cost: null,
              description: null, currency: 'VND'
            }
          });

        if (settings.categoryCosts && settings.categoryCosts.length > 0) {
          for (let i = 0; i < settings.categoryCosts.length; ++i) {
            let c = settings.categoryCosts[i];
            mixCategories.unshift(
              {
                categoryId: c.categoryId,
                categoryName: c.categoryName,
                cost: c.cost,
                description: c.description,
                currency: c.currency
              }
            );
          };
        }

        console.log("mixCategories", mixCategories);

        this.form.setControl('settings', this.templateService.getTemplateTransporterCostAsFormArray(mixCategories));
        this.settingDataSource.data = this.settings.controls;
      }
    })
  }

  get settings(): FormArray {
    return this.form.get('settings') as FormArray;
  }

  createSetting(id: any): FormGroup {
    return new FormGroup({
      id: new FormControl(id),
      cost: new FormControl(),
      description: new FormControl(),
      currency: new FormControl('VND')
    })
  }

  okClick(): void {

    let valid = this.settings.controls.map(c => c.value).filter((c: any) => c.cost <= 0)?.length > 0;
    if (valid) {
      this.alertService.showToastMessage("Cần nhập đầy đủ chi phí");
      return;
    }

    let settings = this.settings.controls.map((c: any) => c.value)
      .filter(c => c.cost && c.cost > 0);

    let data = {
      id: this.data.id,
      code: this.form.get("code")?.value,
      name: this.form.get("name")?.value,
      description: this.form.get("description")?.value,
      settings: {
        categoryCosts: settings
      }
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

  remove(element: any) {
    this.settings.controls = this.settings.controls.filter((s: any) => s.value.id !== element.value.id);
    this.settingDataSource.data = this.settings.controls;
  }

  addSetting() {
    let newCost = this.getLastCost();
    if (newCost || this.settings.controls.length == 0) {
      this.settings.push(this.createSetting(this.configService.getNewUid()));
    } else {
      this.alertService.showToastMessage("Cần nhập chi phí");
    }
    this.settingDataSource.data = this.settings.controls;
  }

  getLastCost() {
    return this.settings.controls.map(c => c.value).slice(-1)[0].cost;
  }

}