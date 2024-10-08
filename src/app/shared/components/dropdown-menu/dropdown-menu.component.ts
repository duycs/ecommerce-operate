import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-dropdown-menu',
    templateUrl: 'dropdown-menu.component.html'
})

export class DropdownMenuComponent implements OnInit {
    @Input() name = 'Menu';
    @Input() items: any;

    ngOnInit(): void {
        console.log("items", this.items);
    }

}