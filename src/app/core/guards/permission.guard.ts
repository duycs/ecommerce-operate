import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../authentication/auth.service";

export class PermissionGuard {
  static forPermissions(permissions: any[]) {
    @Injectable({
      providedIn: "root",
    })
    class PermissionCheck implements CanActivate {
      constructor(private authService: AuthService) {}
      canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        console.log(permissions);
        return this.authService.hasPermission(permissions);
      }
    }

    return PermissionCheck;
  }
}
