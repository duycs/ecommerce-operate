import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
    selector: 'app-chip',
    templateUrl: './chip.component.html',
})

export class ChipComponent implements OnInit {
    @Input() chips: any;

    ngOnInit(): void {
    }
}