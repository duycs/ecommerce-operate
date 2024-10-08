import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared.module';
import { PrintComponent } from './print.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { PrintOrderComponent } from './print-order/print-order.component';
import { PrintOrderDetailItemComponent } from './order-detail-item/print-order-detail-item.component';
import { PrintOrderSubComponent } from './print-order-sub/print-order-sub.component';
import { PrintService } from 'src/app/services/print.service';
import { BREAKPOINT } from '@angular/flex-layout';
import { PrintOrderDeliverComponent } from './print-order-deliver/print-order-deliver.component';
import { PrintMoneyPayComponent } from './print-money-pay/print-money-pay.component';
import { PrintMoneyCollectComponent } from './print-money-collect/print-money-collect.component';
import { PrintOrderCollectComponent } from './print-order-collect/print-order-collect.component';

const PRINT_BREAKPOINTS = [
    {
        alias: 'xs.print',
        suffix: 'XsPrint',
        mediaQuery: 'print and (max-width: 210mm)',
        overlapping: false
    }
];

const routes: Routes = [
    {
        path: 'print',
        outlet: 'print',
        component: PrintComponent,
        children: [
            {
                path: 'order/:id',
                component: PrintOrderComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'order-sub/:id',
                component: PrintOrderSubComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'order-deliver/:id',
                component: PrintOrderDeliverComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'money-pay/:id',
                component: PrintMoneyPayComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'money-collect/:id',
                component: PrintMoneyCollectComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'order-collect/:id',
                component: PrintOrderCollectComponent,
                canActivate: [AuthGuard]
            },
        ]
    }
];

@NgModule({
    declarations: [
        PrintComponent,
        PrintOrderComponent,
        PrintOrderDetailItemComponent,
        PrintOrderSubComponent,
        PrintOrderDeliverComponent,
        PrintMoneyPayComponent,
        PrintMoneyCollectComponent
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
    providers: [
        PrintService,
        { provide: BREAKPOINT, useValue: PRINT_BREAKPOINTS, multi: true }
    ],
    bootstrap: [PrintComponent]
})
export class PrintModule { }