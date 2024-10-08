import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from 'src/app/shared/config.service';
import { ProductService } from 'src/app/services/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ShopService } from 'src/app/services/shop.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MappingModels } from 'src/app/shared/models/mappingModels';

@Component({
  selector: 'app-create-product-group',
  templateUrl: './create-product-group.component.html',
})

export class CreateProductGroupComponent implements OnInit {
  form!: FormGroup;
  status: any[] = [
    { value: "true", name: "Hiển thị" },
    { value: "false", name: "Không hiển thị" },
  ];
  productGroups: any = [];
  name!: string;
  code!: string;
  suggestName: string = '';
  suggestCode: string = '';

  templateProfits!: any[];
  transporterCostTemplates!: any[];
  templateTransporterCosts!: any[];
  shops!: any[];
  products!: any[];
  productCategories!: any[];
  shopSettings!: any[];
  productSelected: any = [];
  categorySelectedId!: any;

  length = 50;
  pageSize = 10;
  pageIndex = 1;
  pageSizeOptions = [5, 10, 15, 20];
  pageEvent!: PageEvent;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  productSelectedDataSource = new MatTableDataSource<any>([]);
  productDisplayColumns = ['numbericalOrder', 'image', 'name', 'shop', 'category', 'brand', 'originPrice', 'autoProductPrice', 'newPrice', 'language', 'autoApprove', 'activeStatus', 'approveStatus', 'action'];

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private alertService: AlertService,
    private shopService: ShopService,
    private productService: ProductService,
    private mappingModels: MappingModels,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      visible: ["true"],
      description: [null],
      shopId: [null],
      categoryId: [null],
      productId: [null]
    });

    this.getProductGroups();
  }

  removeProduct(element: any) {
    this.productSelected = this.productSelected.filter((s: any) => s.id !== element.id);
    this.productSelectedDataSource.data = this.productSelected;
  }

  getProductGroups(field: string = '', value: string = '') {
    let queryParams: any = {};
    if (field === 'name') {
      queryParams.name = value;
    }

    if (field === 'code') {
      queryParams.code = value;
    }

    this.productService.getProductGroups(queryParams, 0, 1000)
      .subscribe((res: any) => {
        this.productGroups = res;
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  outputCode(event: any) {
    this.code = event.value;
    this.getProductGroups("code", this.code);
  }

  outputName(event: any) {
    this.name = event.value;
    this.getProductGroups("name", this.name);
  }

  searchProduct(event: any) {
    this.name = event.value;
    this.getProducts("name", this.name);
  }

  selectProduct(event: any) {
    console.log(event);
    this.addProduct(event);
  }

  getProducts(field: string = '', value: any = null) {
    let queryParams: any = {};
    if (field === 'name') {
      queryParams.name = value;
    }

    if (field === 'code') {
      queryParams.code = value;
    }

    if (queryParams.value !== '') {
      this.productService.getProducts(queryParams, 0, 10).subscribe((res: any) => {
        this.products = res;
      });
    } else {
      this.products = [];
    }
  }

  searchCategory(event: any) {
    this.name = event.value;
    this.getCategories("name", this.name);
  }

  selectCategory(event: any) {
    console.log(event);
    this.categorySelectedId = event.id;
  }

  getCategories(field: string = '', value: any = null) {
    let queryParams: any = {};
    if (field === 'name') {
      queryParams.name = value;
    }

    if (field === 'code') {
      queryParams.code = value;
    }

    if (queryParams.value !== '') {
      this.productService.getProductCategories(queryParams, 0, 10).subscribe((res: any) => {
        if (res && res.data) {
          this.productCategories = res.data;
        }
      });
    } else {
      this.productCategories = [];
    }
  }

  searchShop(event: any) {
    this.name = event.value;
    this.getShops("name", this.name);
  }

  selectShop(event: any) {
    console.log(event);
    this.productService.getProducts({ categoryId: this.categorySelectedId, shopId: event.id }, 0, 1000).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.addProducts(res);
      }
    });
  }

  getShops(field: string = '', value: any = null) {
    let queryParams: any = {};
    if (field === 'name') {
      queryParams.name = value;
    }

    if (field === 'code') {
      queryParams.code = value;
    }

    if (queryParams.value !== '') {
      this.shopService.getShops(queryParams, 0, 10).subscribe((res: any) => {
        if (res && res.data) {
          this.shops = res.data;
        }
      });
    } else {
      this.shops = [];
    }
  }

  save(): void {
    let productIds = this.productSelected.map((p: any) => p.id);

    let data = {
      code: this.code,
      name: this.name,
      visible: ~~this.form.get("visible")?.value,
      description: this.form.get("description")?.value,
      productIds: productIds
    };

    this.productService.createProductGroup(data)
      .subscribe((res: any) => {
        this.alertService.showToastMessage(`Tạo nhóm sản phẩm ${data.name}`);

      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  handlePageEvent(e: PageEvent) {
    console.log("page", e);

    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  addProduct(product: any) {
    this.productSelected.push(this.mappingModels.ToDisplayProductDto(product));
    this.productSelectedDataSource.data = this.productSelected;
  }

  addProducts(products: any[]) {
    this.productSelected = this.productSelected.concat(this.mappingModels.ToDisplayProductDtos(products));
    this.productSelectedDataSource.data = this.productSelected;
  }

}
