import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { debounceTime, distinctUntilChanged, takeUntil, timeout } from "rxjs/operators";

@Component({
  selector: "app-input-search-dropdown",
  templateUrl: "./input-search-dropdown.component.html",
  styleUrls: ["./input-search-dropdown.component.css"]
})
export class InputSearchDropdownComponent implements OnInit {
  form!: FormGroup;
  isMatch = false;
  @Input() value!: any;
  @Input() pinValue!: boolean;
  @Input() placeholder = "";
  @Input() label = "";
  @Input() data: any = [];
  @Input() ignoreText!: any;
  @Input() field: string = '';
  @Output() output = new EventEmitter<string>();
  @Output() outChoose = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.form = this.fb.group({
      value: [this.value ?? null],
    });

    this.form.get('value')?.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged()
      ).subscribe((text: any) => {
        this.value = text;

        console.log(this.value);

        if (!this.value || this.value === '') {
          this.data = [];
        }

        let item = this.data?.find((c: any) => c[this.field] === text);
        this.isMatch = item ? true : false;

        let result: any = {
          isMath: this.isMatch,
          item: item,
          value: text
        };

        if (this.ignoreText && this.ignoreText !== '') {
          let isIgnore = this.data.find((c: any) => c[this.field] === this.ignoreText);
          if (isIgnore) {
            result.isMatch = true;
          }
        }

        this.output.emit(result);
      });
  }

  clear() {

  }

  choose(option: any) {
    this.outChoose.emit(option);
    this.data = [];

    if (this.pinValue) {
      this.form.get('value')?.setValue(option.name);

      setTimeout(() => {
        this.data = [];
      }, 1000)
    }
  }
}
