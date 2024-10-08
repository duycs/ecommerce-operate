import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { MaterialModule } from './material.module';
import { AppComponent } from "./app.component";
import { NavMenuComponent } from './core/nav-menu/nav-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared.module';
import { HeaderComponent } from './core/header/header.component';
import { HomeComponent } from './modules/home/home.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfigService } from './shared/config.service';
import { CoreModule } from './core/core.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AuthGuard } from './core/guards/auth.guard';
import { TokenInterceptorService } from './core/interceptors/token-interceptor';
import { AuthenticationModule } from './core/authentication/authentication.module';
import { AuthenticationComponent } from './core/authentication/authentication.component';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { AccountModule } from './modules/account/account.module';
import { LoginComponent } from './core/authentication/login/login.component';
import { MatMenuModule } from '@angular/material/menu';
import { SupplierModule } from './modules/supplier/supplier.module';
import { SupplierComponent } from './modules/supplier/supplier.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RegisterComponent } from './core/authentication/register/register.component';
import { SbbModule } from './modules/sbb/sbb.module';
import { SbbComponent } from './modules/sbb/sbb.component';
import { ReportComponent } from './modules/sbb/report/report.component';
import { ChatComponent } from './modules/chat/chat.component';
import { ChatModule } from './modules/chat/chat.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { SideMenuComponent } from './core/side-menu/side-menu.component';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { SettingComponent } from './modules/setting/setting.component';
import { SettingModule } from './modules/setting/setting.module';
import { NavigationService } from './services/navigation.service';
import { DateService } from './shared/date.service';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { PrintComponent } from './modules/print/print.component';
import { PrintModule } from './modules/print/print.module';
import { AuthService } from './core/authentication/auth.service';
import { CustomRouteReuseStrategy } from './shared/custom-route-reuse-strategy';
import { ChatBoxComponent } from './modules/mobile/chat-box/chat-box.component';
import { MAT_RIPPLE_GLOBAL_OPTIONS, RippleGlobalOptions } from '@angular/material/core';

const globalRippleConfig: RippleGlobalOptions = {
  disabled: true,
  animation: {
    enterDuration: 300,
    exitDuration: 0
  }
};

const appRoutes: Routes = [
  // { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  // {
  //   path: 'print',
  //   outlet: 'print',
  //   component: PrintComponent,
  //   children: [
  //     { path: 'order/:id', component: PrintOrderComponent }
  //   ]
  // },
  { path: 'print', outlet: 'print', loadChildren: () => import('./modules/print/print.module').then(m => m.PrintModule), component: PrintComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/sbb/orders', component: ReportComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/sbb/orders', component: ReportComponent, canActivate: [AuthGuard] },
  { path: 'supplier', loadChildren: () => import('./modules/supplier/supplier.module').then(m => m.SupplierModule), component: SupplierComponent, canActivate: [AuthGuard] },
  { path: 'sbb', loadChildren: () => import('./modules/sbb/sbb.module').then(m => m.SbbModule), component: SbbComponent, canActivate: [AuthGuard] },
  { path: 'chats', loadChildren: () => import('./modules/chat/chat.module').then(m => m.ChatModule), component: ChatComponent },
  { path: 'authentication', loadChildren: () => import('./core/authentication/authentication.module').then(m => m.AuthenticationModule), component: AuthenticationComponent, canActivate: [AuthGuard] },
  { path: 'setting', loadChildren: () => import('./modules/setting/setting.module').then(m => m.SettingModule), component: SettingComponent, canActivate: [AuthGuard,] },
];



@NgModule({
  declarations: [
    HomeComponent,
    AppComponent,
    NavMenuComponent,
    SideMenuComponent,
    HeaderComponent,
    AuthenticationComponent,
    SupplierComponent,
    RegisterComponent,
    LoginComponent,
    ChatComponent,
    SettingComponent,
    ChatBoxComponent
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' }),
    RouterModule.forChild([]),
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MaterialModule,
    CarouselModule,
    MatMenuModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    SharedModule,

    //app modules
    CoreModule,
    AuthenticationModule,
    AccountModule,
    SupplierModule,
    SbbModule,
    ChatModule,
    SettingModule,
    PrintModule,

    // loading
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    LoadingBarModule
  ],
  exports: [RouterModule],
  providers: [
    AuthGuard,
    ConfigService,
    DateService,
    NavigationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    CurrencyPipe,
    DatePipe,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' }
    },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'accent' },
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initWithDependencyFactory,
      deps: [NavigationService, AuthService],
      multi: true
    },
    {provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig}
    // { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function initWithDependencyFactory(
  navigationService: NavigationService,
  authService: AuthService,
) {
  return () => {
    console.log('initWithDependencyFactory - started');
    navigationService.initialize();
    authService.initialize();
    return true;
  }
}