import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/core/authentication/auth.service";
import { AlertService } from "src/app/services/alert.service";
import { ConfigService } from "src/app/shared/config.service";

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit, AfterViewInit {
    subscription!: Subscription;
    form!: FormGroup;
    userId: string = "";
    id!: string;
    activeTab: number = 1;
    defaultImage = "";
    username = "";
    email = "";
    name = "";
    about = "";
    myStyle = "";
    nextProject = "";
    facebook = "";
    twitter = "";
    linkedin = "";
    zalo = "";
    website = "";

    projects!: any[];
    business!: any;

    constructor(
        private fb: FormBuilder,
        private activeRoute: ActivatedRoute,
        private route: Router,
        private authService: AuthService,
        private configService: ConfigService,
        private alertService: AlertService,
    ) { }

    ngAfterViewInit(): void {
       
    }

    ngOnInit(): void {
        this.id = this.activeRoute.snapshot.params['id'];
        this.activeRoute.queryParams
            .subscribe(params => {
                console.log(params);
                this.activeTab = ~~params['tab'];
            }
            );
    }

    setAccount() {
        let account = this.authService.getAccount();

        if (account) {
            this.username = account?.userName || "";
            this.email = account?.email || "";
            this.name = account?.name || "";
            this.about = account?.about || "";
        }
    }

}