import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { ShopService } from 'src/app/services/shop.service';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
})

export class ShopDetailComponent implements OnInit, AfterViewInit {
  currentUser!: any;
  currentUserSubscription!: Subscription;
  shopId!: any;
  shopDetail!: any;

  constructor(
    private mappingModels: MappingModels,
    private shopService: ShopService,
    private alertService: AlertService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) { }

  ngAfterViewInit(): void {
    this.getShop();
  }

  ngOnInit(): void {
    this.shopId = this.activeRoute.snapshot.params['id'];
  }

  getShop() {
    this.shopService.getShop(this.shopId)
      .subscribe(res => {
        this.shopDetail = this.mappingModels.ToDisplayShopDto(res);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  editShop() {
    this.router.navigateByUrl(`/sbb/shops/${this.shopId}/update`);
  }

  updateShop(event: any) {
    this.getShop();
  }
}