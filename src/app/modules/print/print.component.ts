import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: [],
})
export class PrintComponent implements OnInit {
  title = "";
  brand = "";
  showHeader = true;

  constructor(private activedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activedRoute.queryParams.subscribe(queryParams => {
      this.title = queryParams['title'];
      this.brand = queryParams['brand'];
      this.showHeader = queryParams['showHeader'] ?? true;
      console.log(this.showHeader);
    });
  }

}