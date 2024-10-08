import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from 'src/app/material.module';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AuthenticationComponent } from './authentication.component';
import { HttpClient } from '@microsoft/signalr';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
    {
        path: 'authentication',
        component: AuthenticationComponent,
        children: [
            //{ path: 'register', component: RegisterComponent },
            //{ path: 'login', component: LoginComponent },
            { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
            { path: 'callback', component: AuthCallbackComponent },
            { path: 'notfound', component: NotFoundComponent },
            { path: 'forbidden', component: ForbiddenComponent }
        ]
    }
];

@NgModule({
    declarations: [
        //RegisterComponent,
        //LoginComponent,
        ChangePasswordComponent,
        AuthCallbackComponent,
        ForbiddenComponent,
        NotFoundComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        })
    ]
})
export class AuthenticationModule { }