import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
  selector: 'app-order-detail-item-quantity',
  templateUrl: './order-detail-item-quantity.component.html',
  styleUrls: ['./order-detail-item-quantity.component.css']
})

export class OrderDetailItemQuantityComponent implements OnInit, AfterViewInit {
  @Input() orderId!: any;
  @Input() products!: any[];
  @Input() showQuantityStatus: boolean = true;
  @Input() notDisplayedColumns: any = [];
  @Input() screen = "";

  isShowTotalPrice: boolean = true;
  displayPercent = 41;
  marginRightTotalPrice = 12;

  displayedColumns: string[] = ['numbericalOrder', 'image', 'name', 'detail', 'quantity'];

  constructor(
    private dialog: MatDialog,
    private mappingModels: MappingModels,
  ) { }

  ngAfterViewInit(): void {

    this.products = this.mappingModels.mappingProductOrderDetail(this.products);
    this.displayedColumns = this.displayedColumns.filter((c: any) => !this.notDisplayedColumns.includes(c));
    this.isShowTotalPrice = this.displayedColumns.filter((c: any) => c == 'totalPrice')?.length > 0;

    console.log("product", this.products);

    if (this.screen === "order-enter") {
      this.displayPercent = 77;
    } else if (this.screen === "order-deliver") {
      this.displayPercent = 45;
    }

    if (!this.showQuantityStatus) {
      this.marginRightTotalPrice = 77;
    }
  }

  ngOnInit(): void {
  }

  confirmDeliveryOrder() {

  }

  getQuantityClass() {
    if (this.screen === "dialog") {
      return 'label red';
    }

    return 'label';
  }

}