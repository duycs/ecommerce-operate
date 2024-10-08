import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared.module';
import { ChatComponent } from './chat.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { WebChatComponent } from './web/web-chat.component';
import { MobileChatComponent } from './mobile/mobile-chat.component';

const routes: Routes = [
    {
        path: 'chats',
        component: ChatComponent,
        children: [
            {
                path: 'web',
                component: WebChatComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mobile',
                component: MobileChatComponent,
                // data: [{ noLogin: true}]
            },
        ]
    }
];

@NgModule({
    declarations: [
        WebChatComponent,
        MobileChatComponent,
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
    providers: [AuthGuard],
    bootstrap: [ChatComponent]
})
export class ChatModule { }