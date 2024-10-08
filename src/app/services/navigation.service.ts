import { Injectable } from "@angular/core";
import { JsonPipe, Location } from "@angular/common";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })

export class NavigationService {
  //private history: string[] = [];
  showHeader = true;
  isOpenSideMenu = false;
  isOnlyShowPrintLayout = false;
  isChatMobile = false;
  ignoreUrls = ["login", "print"];
  firebaseSession!: any;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private location: Location) {

    if (!this.getHistoryLocal()) {
      localStorage.setItem("history", JSON.stringify([]));
    }

    this.router.events.subscribe((event) => {
      let history = this.getHistoryLocal();
      if (event instanceof NavigationEnd) {
        localStorage.setItem("url", event.url);
        let lastUrl = history.length > 1 ? history[history.length - 1] : "";
        let isIgnoreUrl = this.ignoreUrls.findIndex((e: any) => event.urlAfterRedirects.includes(e.toLocaleLowerCase())) > 0;

        if (lastUrl !== event.urlAfterRedirects && !isIgnoreUrl) {
          history.push(event.urlAfterRedirects);
          this.setHistoryLocal(history);
        }

        // validation display by url
        if (event.url.includes('/logout')) {
          this.setHistoryLocal([]);
        } else {
          this.displayValidation();
        }
      }
    });
  }

  initialize() {
    console.log("Initialize NavigationService");
  }

  back(): void {
    let history = this.getHistoryLocal();
    let url = history.length > 1 ? history[history.length - 2] : history[history.length - 1];

    history.pop();
    this.setHistoryLocal(history);

    if (history.length > 0 && url) {
      this.router.navigateByUrl(url);
    } else {
      //this.router.navigateByUrl("/");
    }
  }

  getHistoryLocal() {
    let historyLocal = localStorage.getItem("history");
    if (historyLocal) {
      let history = JSON.parse(historyLocal);
      return history;
    }

    return [];
  }

  setHistoryLocal(history: any[]) {
    localStorage.setItem("history", JSON.stringify(history));
  }

  displayValidation(): any {
    let url = localStorage.getItem("url") ?? '';

    if (url.includes('/chats/mobile')) {
      this.showHeader = false;
      this.isOpenSideMenu = false;
      this.isChatMobile = true;

      let userId = this.activeRoute.snapshot.queryParamMap.get('id');
      this.firebaseSession = `${environment.firebase.firebaseAccountLocalPrefix}_${userId}`;
    }
    else if (url.includes('/login') || url.includes('register')) {
      this.isOpenSideMenu = false;
    } else if (url.includes('print')) {
      this.isOnlyShowPrintLayout = true;
    }
    else {
      this.isOpenSideMenu = true;
    }

    return {
      showHeader: this.showHeader,
      isOpenSideMenu: this.isOpenSideMenu,
      isOnlyShowPrintLayout: this.isOnlyShowPrintLayout,
      isChatMobile: this.isChatMobile
    };
  }
}