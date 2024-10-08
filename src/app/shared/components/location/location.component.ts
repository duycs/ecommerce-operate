import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LocationService } from "src/app/services/location.service";
import { HttpErrorResponse } from "@angular/common/http";
import { AlertService } from "src/app/services/alert.service";
import { ChildActivationStart } from "@angular/router";

@Component({
    selector: "app-location",
    templateUrl: "./location.component.html",
    styleUrls: ["./location.component.css"]
})

export class LocationComponent implements OnInit, AfterViewInit {
    form!: FormGroup;
    provinces: any = [];
    districts: any[] = [];
    wards: any[] = [];
    name = "";
    @Output() locationSelected = new EventEmitter<any>();
    @Input() index = 0;
    @Input() location!: any;
    @Input() wardId!: any;

    constructor(
        private locationService: LocationService,
        private alertService: AlertService,
        private fb: FormBuilder,
        private _formBuilder: FormBuilder) { }

    ngAfterViewInit(): void {
        this.getLocations();
    }

    ngOnInit() {
        let provinceId = this.location?.province?.id || null;
        let districtId = this.location?.district?.id || null;
        let wardId = this.location?.ward?.id || null;
        this.form = this.fb.group({
            provinceId: [provinceId, null],
            districtId: [districtId, null],
            wardId: [wardId, null]
        });
    }

    getLocations() {
        this.locationService.getLocations()
            .subscribe({
                next: (res) => {
                    if (!Array.isArray(res)) {
                        return;
                    };


                    this.provinces = res;

                    // selected
                    this.initSelected();
                },
                error: (err: HttpErrorResponse) => {
                    this.alertService.showToastError();
                    console.log(err);
                }
            });
    }

    initSelected() {
        if (this.wardId) {
            // province
            for (let i = 0; i < this.provinces.length; ++i) {
                // district
                for (let j = 0; j < this.provinces[i].districts.length; ++j) {
                    //wards
                    for (let k = 0; k < this.provinces[i].districts[j].wards.length; ++k) {
                        if (this.wardId === this.provinces[i].districts[j].wards[k].id) {
                            //console.log(this.provinces[i].id, this.provinces[i].districts[j].id, this.provinces[i].districts[j].wards[k].id);
                            this.form.get("provinceId")?.setValue(this.provinces[i].id);
                            this.loadDistricts();
                            this.form.get('districtId')?.setValue(this.provinces[i].districts[j].id);
                            this.loadWards();
                            this.form.get('wardId')?.setValue(this.wardId);
                        }
                    }
                }
            }
        }
    }

    loadDistricts() {
        let provinceId = this.form.get('provinceId')?.value;
        this.districts = this.provinces.find((c: any) => c.id === provinceId).districts;
    }

    loadWards() {
        let districtId = this.form.get('districtId')?.value;
        this.wards = this.districts.find((c: any) => c.id === districtId).wards;
    }

    selectWard() {
        let wardId = this.form.get('wardId')?.value;
        let provinceId = this.form.get('provinceId')?.value;
        let districtId = this.form.get('districtId')?.value;

        let data = { index: this.index, wardId: wardId, districtId: districtId, provinceId: provinceId, name: this.getName(wardId, districtId, provinceId) };
        this.locationSelected.emit(data);
    }

    getName(wardId: any, districtId: any, provinceId: any) {
        let wardName = this.wards.filter(w => { if (w.id === wardId) return w.name })[0].name;
        let districtName = this.districts.filter((w: any) => { if (w.id === districtId) return w.name })[0].name;
        let provinceName = this.provinces.filter((w: any) => { if (w.id === provinceId) return w.name })[0].name;

        return `${wardName}, ${districtName}, ${provinceName}`;
    };
}

