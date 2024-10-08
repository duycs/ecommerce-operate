import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { TransporterService } from 'src/app/services/transporter.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
  selector: 'app-transporter-detail',
  templateUrl: './transporter-detail.component.html',
})

export class TransporterDetailComponent implements OnInit, AfterViewInit {
  id!: any;
  transporter!: any;
  // {
  //   id: "a84fef4d-982a-4f2b-83f9-25b4ab2678b9",
  //   name: "Bắc Nam",
  //   code: "BN",
  //   address: "Kim Văn, Kim Lũ",
  //   description: "Đây là nhà cung cấp test",
  //   phoneNumber: "321321321",
  //   wardName: "Phú Sơn",
  //   districtName: "Nho Quan",
  //   provinceName: "Ninh Bình",
  //   isActived: true,
  //   shops: [
  //     {id: 1, name: "Nhà cung cấp Đại Tài"},
  //     {id: 2, name: "Nhà cung cấp Đại Gia"},
  //     {id: 3, name: "Nhà cung cấp Hâm hấp"},
  //   ],
  //   shopChips: [
  //     {id: 1, name: "Nhà cung cấp Đại Tài"},
  //     {id: 2, name: "Nhà cung cấp Đại Gia"},
  //     {id: 3, name: "Nhà cung cấp Hâm hấp"},
  //   ],
  //   statusChips: [{ "color": "primary", name: 'hoạt động' }]
  // }

  constructor(
    private mappingModels: MappingModels,
    private transporterService: TransporterService,
    private alertService: AlertService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'];
    this.getTransporter();
  }

  getTransporter() {
    this.transporterService.getTransporter(this.id)
      .subscribe(res => {
        this.transporter = this.mappingModels.ToDisplayTransporterDto(res);
        let shops = this.transporter.transporterShops.map((c: any) => { return { name: c.shopName, id: c.shopId } });
        this.transporter.shops = shops;
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  edit() {
    this.router.navigateByUrl(`/sbb/transporters/${this.id}/update`);
  }

}