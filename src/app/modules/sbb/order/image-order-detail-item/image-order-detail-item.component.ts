import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
  selector: 'app-image-order-detail-item',
  templateUrl: './image-order-detail-item.component.html',
  styleUrls: ['./image-order-detail-item.component.css']
})

export class ImageOrderDetailItemComponent implements OnInit {
  currentUser!: any;
  currentUserSubscription!: Subscription;
  orderId!: any;
  productColors: any[] = [];

  @Input() products!: any[];
  @Input() showQuantityStatus: boolean = true;
  @Input() notDisplayedColumns: any = [];
  @Input() screen = "";

  isShowTotalPrice: boolean = true;
  displayPercent = 41;
  marginRightTotalPrice = 12;

  displayedColumns: string[] = ['name', 'detail', 'quantity', 'price', 'percentDiscount', 'cashDiscount', 'totalPrice'];

  constructor(
    private mappingModels: MappingModels,
  ) { }

  ngOnInit(): void {
    this.products = this.mappingModels.mappingProductOrderDetail(this.products);
    this.productColors = this.products.map((p: any) => p.productColors).flat(1);
  }

}