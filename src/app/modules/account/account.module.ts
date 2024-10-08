import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { AccountComponent } from './account.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';

const routes: Routes = [
    {
        path: 'account',
        component: AccountComponent,
        children: [
            {
                path: ':id',
                component: UserComponent,
                canActivate: [AuthGuard],
            },
        ],
    }
];

@NgModule({
    declarations: [
        AccountComponent,
        UserComponent,
    ],
    imports: [
        SharedModule,
        MaterialModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forChild(routes),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        })
    ],
    providers: [],
    bootstrap: [AccountComponent]
})
export class AccountModule { }
