import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputSearchComponent } from './shared/components/input-search/input-search.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NextStepComponent } from './shared/components/next-step/next-step.component';
import { DropdownSearchComponent } from './shared/components/dropdown-search/dropdown-search.component';
import { LocationComponent } from './shared/components/location/location.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { DropdownMenuComponent } from './shared/components/dropdown-menu/dropdown-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from './app.module';
import { UploadComponent } from './shared/components/upload/upload.component';
import { CardPhotoGridComponent } from './shared/components/card-photo-grid/card-photo-grid.component';
import { DownloadComponent } from './shared/components/download/download.component';
import { DateDisplayPipe } from './shared/pipes/date-display.pipe';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { ChatListComponent } from './shared/components/chat/chat-list.component';
import { SendPopupComponent } from './shared/components/chat/send-popup/send-popup.component';
import { ChatBoxComponent } from './shared/components/chat/chat-box.component';
import { ChipComponent } from './shared/components/chip/chip.component';
import { BackButtonComponent } from './shared/components/back-button/back-button.component';
import { CloseButtonComponent } from './shared/components/close-button/close-button.component';
import { InputCounterComponent } from './shared/components/input-counter/input-counter.component';
import { ChipsAutocompleteComponent } from './shared/components/chip-autocomplete/chip-autocomplete.component';
import { CheckboxSectionComponent } from './shared/components/checkbox-section/checkbox-section.component';
import { DateRangePickerComponent } from './shared/components/date-range-picker/date-range-picker.component';
import { FilterAutoCompleteComponent } from './shared/components/filter-autocomplete/filter-autocomplete.component';
import { CurrencyDisplayPipe } from './shared/pipes/currency.pipe';
import { SharePopupComponent } from './shared/components/share-popup/share-popup.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NotificationListComponent } from './shared/components/notification/notification-list.component';
import { SendImageCameraPopupComponent } from './shared/components/chat/send-image-camera-popup/send-image-camera-popup.component';
import { ScrollNearEndDirective } from './shared/directives/scrolling.directive';
import { InputSearchDropdownComponent } from './shared/components/input-search-dropdown/input-search-dropdown.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule,
        HttpClientModule,
        CarouselModule,
        MatMenuModule,
        AsyncPipe,
        ClipboardModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        RouterModule.forChild([

        ]),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideStorage(() => getStorage()),
        provideFirestore(() => getFirestore()),
    ],
    declarations: [
        InputSearchDropdownComponent,
        InputSearchComponent,
        NextStepComponent,
        DropdownSearchComponent,
        LocationComponent,
        DropdownMenuComponent,
        UploadComponent,
        CardPhotoGridComponent,
        DownloadComponent,
        DateDisplayPipe,
        CurrencyDisplayPipe,
        ChatListComponent,
        ChatBoxComponent,
        ChipComponent,
        BackButtonComponent,
        CloseButtonComponent,
        InputCounterComponent,
        ChipsAutocompleteComponent,
        CheckboxSectionComponent,
        DateRangePickerComponent,
        FilterAutoCompleteComponent,
        SharePopupComponent,
        SendPopupComponent,
        SendImageCameraPopupComponent,
        NotificationListComponent,
        ScrollNearEndDirective 
    ],
    exports: [
        InputSearchDropdownComponent,
        InputSearchComponent,
        NextStepComponent,
        DropdownSearchComponent,
        LocationComponent,
        DropdownMenuComponent,
        UploadComponent,
        CardPhotoGridComponent,
        DownloadComponent,
        DateDisplayPipe,
        CurrencyDisplayPipe,
        ChatListComponent,
        ChatBoxComponent,
        ChipComponent,
        BackButtonComponent,
        CloseButtonComponent,
        InputCounterComponent,
        ChipsAutocompleteComponent,
        CheckboxSectionComponent,
        DateRangePickerComponent,
        FilterAutoCompleteComponent,
        SharePopupComponent,
        SendPopupComponent,
        SendImageCameraPopupComponent,
        NotificationListComponent,
        ScrollNearEndDirective
    ]
})
export class SharedModule { }