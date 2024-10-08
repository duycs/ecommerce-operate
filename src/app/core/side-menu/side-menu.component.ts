import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { AuthService } from "../authentication/auth.service";
import { environment } from "src/environments/environment";
import { ConfigService } from "src/app/shared/config.service";

@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.css']
})

export class SideMenuComponent implements OnInit, AfterViewInit {
    menuList: any;
    selected: any = {};
    isAuthenticated = false;
    buildVersion: string = "";

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private authService: AuthService,
        private configService: ConfigService
    ) {  

        this.menuList = [
            { icon: "dashboard", label: "Dashboard", route: "/sbb/reports", real: 'done', hasPermission: this.authService.hasGroupPermission([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]) },
            {
                icon: "card_travel", label: "Sản phẩm", route: "/sbb/products", hasPermission: this.authService.hasGroupPermission([1]),
                subMenu: [
                    { label: "Danh sách sản phẩm", route: "/sbb/products", hasPermission: this.authService.hasPermission([1]) },
                    { label: "Sản phẩm đặt hàng", route: "/sbb/product-orders", hasPermission: this.authService.hasPermission([1]) },
                    // { label: "Cập nhật giá", route: "/sbb/product-price-settings", },
                    { label: "Danh mục sản phẩm", route: "/sbb/product-categories", hasPermission: this.authService.hasPermission([1]) },
                    { label: "Nhóm sản phẩm", route: "/sbb/product-groups", hasPermission: this.authService.hasPermission([1]) },
                ]
            },
            {
                icon: "brightness_auto", label: "Thiết lập mẫu", route: "/sbb/templates/product-prices", hasPermission: this.authService.hasGroupPermission([1,5]),
                subMenu: [
                    { label: "Mẫu cài đặt", route: "/sbb/templates", hasPermission: this.authService.hasGroupPermission([5]), },
                    { label: "Mẫu lợi nhuận", route: "/sbb/templates/product-profits", hasPermission: this.authService.hasGroupPermission([5]), },
                    // { label: "Template lợi nhuận theo danh mục", route: "/sbb/templates/category-transporter-costs", },
                    { label: "Mẫu phí vận chuyển theo danh mục", route: "/sbb/templates/transporter-costs", hasPermission: this.authService.hasGroupPermission([5]), },
                    { label: "Thiết lập giá sản phẩm theo NCC", route: "/sbb/shop-product-price-settings", hasPermission: this.authService.hasGroupPermission([5]), },
                    { label: "Thiết lập giá sản phẩm", route: "/sbb/product-price-settings", hasPermission: this.authService.hasGroupPermission([5])},
                ]
            },
            {
                icon: "desktop_mac", label: "Nhật ký bài đăng", route: "/sbb/posts", hasPermission: this.authService.hasGroupPermission([10])
                // subMenu: [
                //     { label: "Danh sách nhật ký bài đăng", route: "/sbb/posts",  },
                // ]
            },
            {
                icon: "list_alt", label: "Đơn hàng", route: "/sbb/orders", hasPermission: this.authService.hasGroupPermission([2, 3, 4, 5]),
                subMenu: [
                    { label: "Đơn hàng từ khách hàng", route: "/sbb/orders", hasPermission: this.authService.hasPermission([2]) },
                    { label: "Đơn hàng con", route: "/sbb/order-subs", hasPermission: this.authService.hasPermission([2]) },
                    { label: "Đơn chuyển hàng từ NCC", route: "/sbb/order-transfers", hasPermission: this.authService.hasPermission([2]) }, // Tạo từ app NCC
                    { label: "Đơn nhập hàng NCC", route: "/sbb/order-enters", hasPermission: this.authService.hasPermission([4]) }, // tạp từ Tạo đơn nhập hàng mới từ Đơn chuyển hàng NCC
                    { label: "Đơn giao hàng cho khách", route: "/sbb/order-delivers", hasPermission: this.authService.hasPermission([3]) },
                    { label: "Danh sách phiếu nhặt hàng", route: "/sbb/order-collects", hasPermission: this.authService.hasPermission([2, 3, 4, 5]) },
                ]
            },
            {
                icon: "local_shipping", label: "Nhà vận chuyển", route: "/sbb/transporters", hasPermission: this.authService.hasGroupPermission([3, 4, 5, 6])
                // subMenu: [
                //     { label: "Danh sách nhà vận chuyển", route: "/sbb/transporters",  },
                // ]

            },
            {
                icon: "account_balance", label: "Nhà cung cấp", route: "/sbb/shops", hasPermission: this.authService.hasGroupPermission([6]),
                subMenu: [
                    { label: "Danh sách nhà cung cấp", route: "/sbb/shops", hasPermission: this.authService.hasPermission([17]) },
                    { label: "Thiết lập giá sản phẩm", route: "/sbb/shop-product-price-settings", hasPermission: this.authService.hasPermission([5]) },
                ]
            },
            {
                icon: "account_box", label: "Khách hàng", route: "/sbb/customers", hasPermission: this.authService.hasGroupPermission([2]),
                subMenu: [
                    { label: "Danh sách khách hàng", route: "/sbb/customers", hasPermission: this.authService.hasPermission([6]) },
                    { label: "Kích hoạt tài khoản", route: "/sbb/customer-wait-actives", hasPermission: this.authService.hasPermission([6]) },
                    { label: "Thiết lập định mức công nợ", route: "/sbb/customer-debt-configs", hasPermission: this.authService.hasPermission([6]) },
                ]
            },
            {
                icon: "account_balance_wallet", label: "Kế toán", route: "/sbb/finances", hasPermission: this.authService.hasGroupPermission([2]),
                subMenu: [
                    { label: "Tài khoản tiền", route: "/sbb/money-accounts", hasPermission: this.authService.hasPermission([6]) },
                    { label: "Nhập quỹ", route: "/sbb/fund-entries", hasPermission: this.authService.hasPermission([6]) },
                    { label: "Xuất quỹ", route: "/sbb/fund-releases", hasPermission: this.authService.hasPermission([6]) },
                ]
            },
            {
                icon: "monetization_on", label: "Thu/Chi", route: "/sbb/finances", hasPermission: this.authService.hasGroupPermission([2]),
                subMenu: [
                    { label: "Phiếu thu", route: "/sbb/money-collects", hasPermission: this.authService.hasPermission([6]) },
                    { label: "Phiếu chi", route: "/sbb/money-pays", hasPermission: this.authService.hasPermission([6]) },
                    { label: "Tổng hợp thu/chi", route: "/sbb/money-statistic", hasPermission: this.authService.hasPermission([6]) },
                    { label: "Lý do thu/chi", route: "/sbb/money-reasons", hasPermission: this.authService.hasPermission([6]) },
                ]
            },
            {
                icon: "group_work", label: "Bộ phận", route: "/sbb/departments", hasPermission: this.authService.hasGroupPermission([2])
                // subMenu: [
                //     { label: "Tài khoản nhân viên", route: "/sbb/staff-accounts" },
                // ]
            },
            {
                icon: "devices", label: "Thiết bị", route: "/sbb/assets", hasPermission: this.authService.hasGroupPermission([2]),
                subMenu: [
                    { label: "Máy in", route: "/sbb/assets/prs", hasPermission: this.authService.hasPermission([6]) },
                ]
            },
            {
                icon: "account_circle", label: "Nhân viên", route: "/sbb/staffs", hasPermission: this.authService.hasGroupPermission([16])
                // subMenu: [
                //     { label: "Tài khoản nhân viên", route: "/sbb/staff-accounts" },
                // ]
            },
            {
                icon: "settings", label: "Cài đặt", hasPermission: this.authService.hasGroupPermission([2]),
                subMenu: [
                    { label: "Nhóm phân quyền", route: "/setting/permission/groups", hasPermission: this.authService.hasPermission([6]) },
                ]
            },
            // { icon: "insert_chart_outlined", label: "Báo cáo", route: "/sbb/reports" },
        ]
    }

    

    ngAfterViewInit(): void {
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                this.findThenClickMenuActive(event.url);
            }
        });
    }

    ngOnInit() {
        this.buildVersion = environment.build;
        this.generateIdforMenus();
    }

    select(type: any, item: any, $event: any) {


        let label = item.label;

        if ((!item.subMenu || item.subMenu.length == 0) && type === 'main') {
            this.router.navigateByUrl(item.route);
        } else {
            this.selected[type] = (this.selected[type] === label ? null : label);
        }
        $event ? $event.stopPropagation() : null;
    }

    isActive(type: any, item: any) {
        return this.selected[type] === item;
    }

    navigateTo(route: any) {
        this.router.navigateByUrl(route);
    }

    generateIdforMenus() {
        let incrementMain = 0;
        let incrementSub = 0;

        this.menuList.forEach((menu: any) => {
            menu.id = "main" + incrementMain++;
        });

        let menus = this.menuList.filter((m: any) => m.subMenu).map((m: any) => m.subMenu).flat(1);
        menus.forEach((menu: any) => {
            menu.id = "sub" + incrementSub++;
        });
    }

    findThenClickMenuActive(url: string) {

        // active main
        this.removeMainActive();

        let menuMainActive = this.menuList.filter((m: any) => m.route === url)[0];
        if (menuMainActive && menuMainActive.id) {
            let elementActive = document.getElementById(menuMainActive.id);
            let liActive = elementActive?.closest('li');
            liActive?.classList.add('main-active');
            elementActive?.classList.add('main-active');
        }

        // active sub
        let menus = this.menuList.filter((m: any) => m.subMenu).map((m: any) => m.subMenu).flat(1);
        for (let i = 0; i < menus.length; ++i) {
            let menu = menus[i];
            let element = document.getElementById(menu.id);
            let ul = element?.closest('li');
            ul?.classList.remove('sub-active');
            element?.classList.remove('sub-active');
        }

        let menuActive = menus.filter((m: any) => m.route === url)[0];
        if (menuActive && menuActive.id) {
            let elementActive = document.getElementById(menuActive.id);
            let ulActive = elementActive?.closest('li');
            ulActive?.classList.add('sub-active');
            elementActive?.classList.add('sub-active');

            this.removeMainActive();
        }
    }

    removeMainActive() {
        for (let i = 0; i < this.menuList.length; ++i) {
            let menu = this.menuList[i];
            let element = document.getElementById(menu.id);
            let li = element?.closest('li');
            li?.classList.remove('main-active');
            element?.classList.remove('main-active');
        }
    }
}
