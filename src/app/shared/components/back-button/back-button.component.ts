import { Component, Directive, HostListener, Input } from "@angular/core";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: 'app-back-button',
    templateUrl: './back-button.component.html',
})

export class BackButtonComponent {
    constructor(private navigation: NavigationService) { }

    @Input() real!: string;
    @Input() title!: string;

    onClick(): void {
        console.log("back");
        this.navigation.back();
    }
}