import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AccountantService } from "src/app/services/accountant.service";
import { AlertService } from "src/app/services/alert.service";
import { SettingService } from "src/app/services/setting.service";
import { StaffService } from "src/app/services/staff.service";
import { ConfigService } from "src/app/shared/config.service";

const ELEMENT_DATA: any[] = [
  {
    numbericalOrder: 1,
    name: "Duy",
    phone: "0914376766",
    currentDebtLimit: 200000,
    debtLimit: 10000,
    note: "abcd",
  },
];

@Component({
  selector: "app-create-staff",
  templateUrl: "./create-staff.component.html",
  styleUrls: ["./create-staff.component.css"],
})
export class CreateStaffComponent implements OnInit {
  form!: FormGroup;
  avatars: any[] = [];
  moneyAccounts: any[] = [];
  moneyAccountSelected!: any[];
  permissionGroups: any[] = [];
  permissionGroupSelected!: any[];
  defaultPassword = "88888888";
  staffs!: any;
  email!: any;
  phoneNumber!: any;

  constructor(
    private fb: FormBuilder,
    private staffService: StaffService,
    private alertService: AlertService,
    private configService: ConfigService,
    private settingService: SettingService,
    private accountantService: AccountantService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.getMoneyAccountByName();
    this.getPermissionGroupByName();
    this.getStaffs();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      email: [null, Validators.required],
      gender: [null],
      active: [false],
      description: [null],
      dob: new FormControl(new Date()),
    });
  }

  pressChangePhone(event: any) {
    this.phoneNumber = event.target.value;
  }

  outputEmail(event: any) {
    this.email = event.value;
    this.getStaffs("email", this.email);
  }

  outputPhoneNumber(event: any) {
    this.phoneNumber = event.value;
    this.getStaffs("phoneNumber", this.phoneNumber);
  }

  getStaffs(field: string = "", value: string = "") {
    let queryParams: any = {};

    if (field === "email") {
      queryParams.email = value;
    }

    if (field === "phoneNumber") {
      queryParams.phoneNumber = value;
    }

    this.staffService.getStaffs(queryParams, 0, 1000).subscribe(
      (res: any) => {
        this.staffs = res;
      },
      (err) => {
        this.alertService.showToastError();
        console.log(err);
      }
    );
  }

  save() {
    if (
      !this.permissionGroupSelected ||
      this.permissionGroupSelected.length < 1
    ) {
      this.alertService.showToastMessage("Cần chọn nhóm quyền");
    }

    let data: any = {
      Name: this.form.get("name")?.value,
      Email: this.email,
      UserName: this.phoneNumber,
      Password: this.defaultPassword,
      PhoneNumber: this.phoneNumber,
      Description: this.form.get("description")?.value,
      Gender: ~~this.form.get("gender")?.value,
      IsActived: Boolean(this.form.get("active")?.value),
      Dob: this.form.get("dob")?.value,
      AvatarUrl: this.avatars[0],
      StaffMoneyAccountIds:
        this.moneyAccountSelected && this.moneyAccountSelected.length > 0
          ? this.moneyAccountSelected?.map((c: any) => c.id)
          : null,
      PermissionGroupIds:
        this.permissionGroupSelected && this.permissionGroupSelected.length > 0
          ? this.permissionGroupSelected?.map((c: any) => c.id)
          : null,
    };

    console.log(data);

    this.staffService.createStaff(data).subscribe(() => {
      this.alertService.showToastMessage(`Tạo nhân viên thành công`);
      this.router.navigateByUrl("/sbb/staffs");
    });
  }

  onSelectMoneyAccounts(event: any) {
    this.moneyAccountSelected = event.selectedOptions.map((c: any) => {
      return {
        id: c.id,
        name: c.name,
      };
    });
    let name = event.searchValue;
    this.getMoneyAccountByName(name);
  }

  getMoneyAccountByName(name: string = "") {
    let queryParams: any = {};

    if (name && name !== "") {
      queryParams.name = name;
    }

    let moneyAccountSelectedIds =
      this.moneyAccountSelected?.map((c: any) => c.id) ?? [];
    this.accountantService
      .getMoneyAccounts(queryParams, 0, 10000)
      .subscribe((data) => {
        if (data && data.length > 0) {
          this.moneyAccounts = data.filter(
            (c: any) => !moneyAccountSelectedIds.includes(c.id)
          );
        }
      });
  }

  onSelectPermissionGroups(event: any) {
    this.permissionGroupSelected = event.selectedOptions.map((c: any) => {
      return {
        id: c.id,
        name: c.name,
      };
    });
    let name = event.searchValue;
    this.getPermissionGroupByName(name);
  }

  getPermissionGroupByName(name: string = "") {
    let queryParams: any = {};

    if (name && name !== "") {
      queryParams.name = name;
    }

    let permissionSelectedIds =
      this.permissionGroupSelected?.map((c: any) => c.id) ?? [];

    this.settingService
      .getPermissionGroups({}, 0, 1000)
      .subscribe((res: any) => {
        if (res) {
          this.permissionGroups = res.filter(
            (c: any) => !permissionSelectedIds.includes(c.id)
          );
        }
      });
  }

  uploadAvartarImageFinished(event: any) {
    if (event) {
      this.avatars = this.avatars.concat(event);
      this.avatars.forEach((image: any) => {
        image = image + new Date().getTime();
      });
    }
  }
}
