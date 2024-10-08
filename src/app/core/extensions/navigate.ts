import { ActivatedRoute, Router } from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class NavigateExtension{
    constructor(
        private route: ActivatedRoute,
        private router: Router) {
      }
    public redirectTo(uri: string) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate([uri]));
      }
}