import {Component, EventEmitter, Output} from '@angular/core';
import {FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgIf, JsonPipe} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: 'date-range-picker.component.html',
  // standalone: true,
  // imports: [
  //   MatFormFieldModule,
  //   MatDatepickerModule,
  //   FormsModule,
  //   ReactiveFormsModule,
  //   NgIf,
  //   JsonPipe,
  //   MatNativeDateModule,
  // ],
})
export class DateRangePickerComponent {
  @Output() outputRange: any = new EventEmitter;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  emitChange(){
    this.outputRange.emit(this.range.value);
  }
}
