import {Component, Input} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {FormsModule} from '@angular/forms';
import {NgFor} from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';

export interface Checkbox {
  name: string;
  completed: boolean;
  color: ThemePalette;
  disabled: boolean;
  subCheckboxs?: Checkbox[];
}

@Component({
  selector: 'app-checkbox-section',
  templateUrl: 'checkbox-section.component.html',
//   styleUrls: ['checkbox-section.component.css'],
})
export class CheckboxSectionComponent {
  @Input() checkbox!: Checkbox;
  //{
    // name: 'Indeterminate',
    // completed: false,
    // color: 'primary',
    // subCheckboxs: [
    //   {name: 'Primary', completed: false, color: 'primary'},
    //   {name: 'Accent', completed: false, color: 'accent'},
    //   {name: 'Warn', completed: false, color: 'warn'},
    // ],
  //};

  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.checkbox.subCheckboxs != null && this.checkbox.subCheckboxs.every((c:any) => c.completed);
  }

  someComplete(): boolean {
    if (this.checkbox.subCheckboxs == null) {
      return false;
    }
    return this.checkbox.subCheckboxs.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.checkbox.subCheckboxs == null) {
      return;
    }
    this.checkbox.subCheckboxs.forEach(t => (t.completed = completed));
  }
}
