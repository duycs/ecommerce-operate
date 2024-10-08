import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MappingModels } from 'src/app/shared/models/mappingModels';
import { EditOrderQuantityComponent } from '../edit-order-quantity/edit-order-quantity.component';

@Component({
  selector: 'app-order-detail-item',
  templateUrl: './order-detail-item.component.html',
  styleUrls: ['./order-detail-item.component.css']
})

export class OrderDetailItemComponent implements OnInit, AfterViewInit {
  @Input() orderId!: any;
  @Input() products!: any[];
  @Input() showQuantityStatus: boolean = true;
  @Input() notDisplayedColumns: any = [];
  @Input() screen = "";
  @Output() outUpdateEvent: any = new EventEmitter;

  isShowTotalPrice: boolean = true;
  displayPercent = 41;
  marginRightTotalPrice = 12;

  displayedColumns: string[] = ['numbericalOrder', 'image', 'name', 'detail', 'quantity', 'price', 'percentDiscount', 'cashDiscount', 'totalPrice', 'action'];

  constructor(
    private dialog: MatDialog,
    private mappingModels: MappingModels,
  ) { }

  ngAfterViewInit(): void {

    this.products = this.mappingModels.mappingProductOrderDetail(this.products);
    this.displayedColumns = this.displayedColumns.filter((c: any) => !this.notDisplayedColumns.includes(c));
    this.isShowTotalPrice = this.displayedColumns.filter((c: any) => c == 'totalPrice')?.length > 0;

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

  openUpdateDialog(element: any, product: any) {

    let selectedColorIndex = product.colorSizes.findIndex((c: any) => c.name == element.name);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      product: product,
      isUpdate: true,
      selectedTabIndex: selectedColorIndex
    };

    const dialogRef = this.dialog.open(EditOrderQuantityComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      result => {
        let product = result?.data;
        if (product) {
          this.remove(product);
          this.products.push(product);

          // remove duplicate
          this.products.forEach((p: any) => {
            if (p.id === product.id) {
              p = product;
            }
          })

          // mapping after update quantity
          this.products = this.mappingModels.mappingProductOrderDetail(this.products);

          // remove quantity 0
          this.products = this.products.filter((c: any) => c.quantity > 0);

          this.products.forEach((c: any) => {
            let totalQuantity = product.productColors?.map((c: any) => c.totalQuantity)?.reduce(function (total: any, item: any) { return total += item });
            product.totalQuantity = totalQuantity;
          })

          // emit out event to update product total quantity
          this.outUpdateEvent.emit(this.products);

        }
      }
    );
  }

  openRemoveDialog(element: any, product: any) {
    if(!element.colorId) return;

    // update product color display
    let productSelected = this.products.find((c: any) => c.id === product.id);
    let productColors = productSelected.productColors.filter((c: any) => c.index !== element.index);
    productSelected.productColors = productColors;

    this.products.forEach((c: any) => {
      if (c.id === productSelected.id) {
        c = productSelected
      }
    });

    // update product children quantity = 0
    for (let i = 0; i < this.products.length; ++i) {
      let product = this.products[i];
      for (let j = 0; j < product.children.length; j++) {
        let c = product.children[j];
        let attributes = c.attributes.filter((c: any) => c.id === element.colorId);
        if (attributes && attributes.length > 0) {
          c.quantity = 0;
        }
      }
    }

    // total child quantity in product
    this.products.forEach((product: any) => {
      let totalQuantity = product.children?.map((c: any) => c.quantity)?.reduce(function (total: any, item: any) { return total += item });
      product.totalQuantity = totalQuantity;
    });

    this.outUpdateEvent.emit(this.products);
  }

  remove(product: any) {
    this.products = this.products.filter((c: any) => c.id !== product.id);
  }

}