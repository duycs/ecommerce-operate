import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { SettingComponent } from './setting.component';
import { PermissionListComponent } from './permission-list/permission-list.component';
import { CreatePermissionComponent } from './create-permission/create-permission.component';
import { PermissionDetailComponent } from './permission-detail/permission-detail.component';
import { EditPermissionComponent } from './edit-permission/edit-permission.component';

const routes: Routes = [
    {
        path: 'setting',
        component: SettingComponent,
        children: [
            {
                path: 'permission/groups',
                component: PermissionListComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'create-permission-group',
                component: CreatePermissionComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'permission/groups/:id',
                component: PermissionDetailComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'permission/groups/:id/edit',
                component: EditPermissionComponent,
                canActivate: [AuthGuard]
            },
        ]
    }
];

@NgModule({
    declarations: [
        PermissionListComponent,
        CreatePermissionComponent,
        PermissionDetailComponent,
        EditPermissionComponent
    ],
    imports: [
        SharedModule,
        MaterialModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        RouterModule.forChild(routes),

    ],
    providers: [],
    bootstrap: [SettingComponent]
})
export class SettingModule { }