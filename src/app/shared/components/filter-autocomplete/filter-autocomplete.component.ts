import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
    selector: 'app-filter-autocomplete',
    templateUrl: 'filter-autocomplete.component.html',
    styleUrls: ['filter-autocomplete.component.css'],
})
export class FilterAutoCompleteComponent implements OnInit {
    form = new FormControl('');
    @Input() options: string[] = [];
    @Input() label: string = "";
    @Output() outSelected: any = new EventEmitter;
    filteredOptions!: Observable<any[]>;

    ngOnInit() {
        this.filteredOptions = this.form.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        let selected = this.options.filter(option => option.toLowerCase().includes(filterValue));

        this.outSelected.emit(selected);

        return selected;
    }
}


