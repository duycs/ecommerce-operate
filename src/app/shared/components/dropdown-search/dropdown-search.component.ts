import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { DatePipe } from "@angular/common";
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Observable, map, startWith } from "rxjs";

@Component({
    selector: "app-dropdown-search",
    templateUrl: "./dropdown-search.component.html",
    styleUrls: ["./dropdown-search.component.css"]
})

export class DropdownSearchComponent implements OnInit, AfterViewInit {
    @Input() title: string = "";
    @Input() allOptions: any[] = [];
    @Output() outSelectedOptions: any = new EventEmitter;
    @ViewChild('optionInput') optionInput!: ElementRef<HTMLInputElement>;

    datePipe = new DatePipe('en-US');
    formatDate = "dd/MM/yyyy";
    optionCtrl = new FormControl();
    inputTextControl = new FormControl();
    filterOptions!: Observable<any[]>;
    selectKeys: any[] = [];
    options: any[] = [];
    selectType = "key"; // key | textValue, dateRangeValue, optionValue
    isSelectKey = true;
    isInputValue = false;
    isDateRange = false;
    currentType: string = '';
    currentSelect = '';

    clickChooseKey = '';
    clickChooseValue = '';
    enterToChooseValue = '';
    filterPlaceHolder = '';
    dateRange = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });

    addOnBlur = true;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    constructor(private _formBuilder: FormBuilder,
        private renderer: Renderer2,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private translate: TranslateService) {

    }

    sliceSelectKeys() {
        let values = this.selectKeys?.slice();
        return values;
    }

    ngAfterViewInit(): void {
    }

    ngOnInit() {
        this.setSelectedOptionFromParams();
        this.translate.get('search.click-choose-key').subscribe((text: string) => { this.clickChooseKey = text });
        this.translate.get('search.click-choose-value').subscribe((text: string) => { this.clickChooseValue = text });
        this.translate.get('search.enter-choose-value').subscribe((text: string) => { this.enterToChooseValue = text });

        this.filterPlaceHolder = this.clickChooseKey;
    }

    setSelectedOptionFromParams() {
        // exist query params then selected filter
        let params = this.activatedRoute.snapshot.queryParams;
        var keyNames = Object.keys(params);

        if (keyNames && keyNames.length > 0) {
            this.allOptions.map(option => {
                keyNames.forEach(keyOption => {

                    if (keyOption.includes(option.id)) {
                        option.isSelected = true;
                        let value = params[keyOption];
                        this.setSelected(value, option.name, false);

                        if (option.type === "option") {
                            option.options.map((o: any) => {
                                if (o.id === value) {
                                    this.setSelected(o.id, o.name, false);
                                }
                            });
                        } else if (option.type === "dateRange") {
                            this.setSelected(value, option.name, false);
                        } else {
                            this.setSelected(value, option.name, false);
                        }
                    }
                });
            });
        } else {
            this.selectKeys = this.getSelectKeys(this.allOptions);
        }

        this.setFilterOptionChange();
    }

    setFilterOptionChange() {
        this.filterOptions = this.optionCtrl.valueChanges.pipe(
            startWith(null),
            map((name: any | null) => (name ? this._filterKeySelected(name) : this.sliceSelectKeys())),
        );
    }

    getSelectKeys(options: any[]) {
        let selectKeys = options.map(o => {
            return { id: o.id, name: o.name, isSelected: o.isSelected }
        });

        return selectKeys;
    }

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        // Clear the input value
        event.chipInput!.clear();

        this.optionCtrl.setValue(null);

        this._updateQueryParams(this.getEventQueryParams().searchParams);
    }

    remove(option: any): void {
        if (this.options && this.options.length > 0) {
            // add key again
            this.selectKeys?.push({ id: option.id, name: option.name, isSelected: false });

            // remove option
            this.options = this.options.filter(o => { if (o.name !== option.name) return o });
        }

        this.optionCtrl.setValue(null);

        this.setSelectKeys();

        this.setFilterOptionChange();

        this._updateQueryParams(this.getEventQueryParams().searchParams);

        this.isInputValue = false;
        this.isDateRange = false;
        this.filterPlaceHolder = this.clickChooseKey;
    }

    clear() {
        this.options.forEach(option => {
            this.remove(option);
        });
        this.selectKeys = this.getSelectKeys(this.allOptions);

        this._updateEmptyQueryParams();

        this.isInputValue = false;
        this.isDateRange = false;
        this.filterPlaceHolder = this.clickChooseKey;
    }

    emitUpdateOptionEvent() {
        let event = this.getEventQueryParams();
        this.outSelectedOptions.emit(event);

        this._updateQueryParams(event.searchParams);
    }

    getEventQueryParams() {
        let event: any = {};
        let searchParams: any = {};
        let values = this.options.map((o: any) => o.values);

        values.forEach(value => {
            let keyVal = value.split(':');
            searchParams[keyVal[0]] = keyVal[1];
        });

        event.options = this.options;
        event.searchParams = searchParams;

        console.log(event);
        return event;
    }

    selectedOption(event: MatAutocompleteSelectedEvent): void {
        let viewValue = event.option.viewValue;
        let value = event.option.value;
        this.setSelected(value, viewValue, true);
    }

    setSelected(value: string, viewValue: string, updateParams: boolean) {
        if (this.isSelectKey) {
            // select key
            this.currentSelect = viewValue;
            let optionSelected = Object.assign({}, this.allOptions.filter(o => o.name === viewValue)[0]);

            if (optionSelected && optionSelected.id) {
                optionSelected.viewValues = `${optionSelected.name.charAt(0).toUpperCase() + optionSelected.name.slice(1)} = `;
                optionSelected.values = `${optionSelected.id}:`;
                this.options.push(optionSelected);

                this.currentType = optionSelected.type;

                // next select value in option
                if (this.currentType === "option") {
                    this.isInputValue = false;
                    this.isDateRange = false;
                    this.selectKeys = optionSelected.options;

                    this.filterPlaceHolder = this.clickChooseValue;
                } else if (this.currentType === "dateRange") {
                    this.isDateRange = true;
                    this.isInputValue = false;

                } else {
                    this.isInputValue = true;
                    this.isDateRange = false;
                    this.selectKeys = [];

                    setTimeout(() => {
                        try {
                            this.renderer.selectRootElement('#inputText').focus();
                        } catch {
                            // ignore if not found element
                        }
                    }, 500);

                    this.filterPlaceHolder = this.enterToChooseValue;
                }

                this.isSelectKey = false;
            }
        } else {

            // select value of option
            if (this.currentType === "option") {
                this.options.map(o => {
                    if (o.name === this.currentSelect) {
                        o.values += value;
                        o.viewValues += viewValue;
                        o.isSelected = true;
                    }
                });
            } else {
                this.setSelectedText(value, false);
            }

            this.setSelectKeys();
            this.isSelectKey = true;
            this.filterPlaceHolder = this.clickChooseKey;
        }

        if (updateParams) {
            this.setUpdateInputQuery();
        }
    }

    setDateRangeValue(updateParams: boolean = true) {
        if (this.dateRange.value.end) {
            let startDate = this.datePipe.transform(this.dateRange.value.start, this.formatDate);
            let endAdd1 = new Date().setDate(this.dateRange.value.end.getDate() + 1);
            let endDate = this.datePipe.transform(endAdd1, this.formatDate);
            let value = `${startDate} - ${endDate}`;
            
            console.log("enter dateRange", value);

            this.options.map(o => {
                if (o.name === this.currentSelect) {
                    o.values += value;
                    o.viewValues += value;
                    o.isSelected = true;
                }
            });

            this.isDateRange = false;
            this.isInputValue = false;
            this.inputTextControl.reset();

            this.setSelectKeys();

            if (updateParams) {
                this.setUpdateInputQuery();
            }
        }
    }

    choosedEndDate() {
        this.setDateRangeValue(true);
    }

    enterDateRange() {
        this.setDateRangeValue(true);
    }

    search() {
        this.outSelectedOptions.emit(this.options);
    }

    onSearchEnter(event: any) {
        //this.outSelectedOptions.emit(this.options);
    }

    onInputValueEnter(event: any) {
        let value = event.target.value;
        this.setSelectedText(value, true);
    }

    setSelectedText(value: string, updateParams: boolean) {
        this.options.map(o => {
            if (o.name === this.currentSelect) {
                o.values += value;
                o.viewValues += value;
                o.isSelected = true;
            }
        });

        this.isDateRange = false;
        this.isInputValue = false;
        this.inputTextControl.reset();

        this.setSelectKeys();

        if (updateParams) {
            this.setUpdateInputQuery();
        }
    }

    setUpdateInputQuery() {
        if (this.optionInput.nativeElement) {
            this.optionInput.nativeElement.value = '';
        }
        this.optionCtrl.setValue(null);

        this._updateQueryParams(this.getEventQueryParams().searchParams);
    }

    setSelectKeys() {
        // next select key 
        // filter remove all selected
        this.selectKeys = this.getSelectKeys(this.allOptions);
        this.selectKeys = this._filterSelectKeys(this.options);
        this.isSelectKey = true;
    }

    private _filterSelectKeys(options: any[]) {
        return this.selectKeys.filter(k => { if (options.filter(o => o.name == k.name && o.isSelected).length == 0) return k });
    }

    private _filterKeySelected(name: any): string[] {
        let keySelected = this.selectKeys.filter((o: any) => o.isSelected == false
            && o.name.toLowerCase().includes(name.toLowerCase()));

        return keySelected;
    }

    private _updateQueryParams(queryParams: Params) {
        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: '', // '' is replace new params
            });
    }

    private _updateEmptyQueryParams() {
        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
            })
    }

}
