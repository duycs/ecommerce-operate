import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-template-product-price-list',
    templateUrl: './template-product-price-list.html',
})

export class TemplateProductPriceListComponent implements OnInit {
    displayedColumns: string[] = ['numbericalOrder', 'shopName', 'percentProfit', 'moneyProfit', 'templateProfit', 'description'];

    @Input() dataSource = new MatTableDataSource<any[]>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    @Input() showHeader = true;

    constructor() { }

    ngAfterViewInit() {
    }

    ngOnInit(): void {
    }
}