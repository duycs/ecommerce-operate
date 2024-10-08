import { Component, Directive, HostListener, Input } from "@angular/core";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: 'app-close-button',
    templateUrl: './close-button.component.html',
})

export class CloseButtonComponent {
    constructor(private navigation: NavigationService) { }

    @Input() title!: string;
}