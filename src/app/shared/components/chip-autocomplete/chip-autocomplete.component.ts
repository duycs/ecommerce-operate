import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { environment } from 'src/environments/environment';

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: 'app-chip-autocomplete',
  templateUrl: 'chip-autocomplete.component.html',
  styleUrls: ['chip-autocomplete.component.css'],
  //standalone: true,
  // imports: [
  //   FormsModule,
  //   MatFormFieldModule,
  //   MatChipsModule,
  //   NgFor,
  //   MatIconModule,
  //   MatAutocompleteModule,
  //   ReactiveFormsModule,
  //   AsyncPipe,
  // ],
})

export class ChipsAutocompleteComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  formCtrl = new FormControl();
  filteredChips: Observable<any[]>;
  chips: any[] = [];
  searchValue!: any;

  @Input() title: string = '';
  @Input() allChips: any[] = []; // [{id: id, name: name, color: color}]
  @Input() selectedChips: any[] = [];
  @Output() outSelectedOptions: any = new EventEmitter;

  @ViewChild('input') elementInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor() {
    this.filteredChips = this.formCtrl.valueChanges.pipe(
      startWith(null),
      map((chip: any | null) => (chip ? this._filter(chip) : this.allChips.slice())),
    );
  }

  ngOnInit(): void {
    if (this.selectedChips && this.selectedChips.length > 0) {
      this.selectedChips.forEach((c: any) => {
        this.chips.push({ id: c.id, name: c.name });
      })
    }
  }

  onSearchEnter(event: any) {
    this.searchValue = event.target.value;
    this.emitUpdateOptionEvent();
  }

  onClickAll(event: any) {
    this.filteredChips = new Observable(ob => { ob.next(this.allChips); })
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && value !== '') {
      this.chips.push(value);
    }

    event.chipInput!.clear();

    this.formCtrl.setValue(null);
  }

  remove(chip: string): void {
    const index = this.chips.indexOf(chip);

    if (index >= 0) {
      this.chips.splice(index, 1);

      this.announcer.announce(`Removed ${chip}`);
    }

    this.emitUpdateOptionEvent();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (event.option.value && event.option.value == '') return;

    let chip = { id: event.option.value.id, value: event.option.value, name: event.option.viewValue };
    this.chips.push(chip);

    if (this.elementInput) {
      this.elementInput.nativeElement.value = '';
    }

    this.formCtrl.setValue(null);

    this.emitUpdateOptionEvent();
  }

  private _filter(value: any = ''): string[] {
    const filterValue = value?.name?.toLowerCase() ?? value.toLowerCase();
    return this.allChips.filter((chip: any) => chip.name.toLowerCase().includes(filterValue));
  }

  emitUpdateOptionEvent() {
    let data = {
      searchValue: this.searchValue,
      selectedOptions: this.chips
    };

    this.outSelectedOptions.emit(data);
  }

  clear() {
    this.chips = [];
    this.emitUpdateOptionEvent();
  }

}
