import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-input-search",
  templateUrl: "./input-search.component.html",
  styleUrls: ["./input-search.component.css"]
})
export class InputSearchComponent implements OnInit {
  form!: FormGroup;
  isMatch = false;
  @Input() value!: any;
  @Input() placeholder = "";
  @Input() label = "";
  @Input() data: any = [];
  @Input() ignoreText!: any;
  @Input() field: string = '';
  @Output() output = new EventEmitter<string>();

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
        let item = this.data.find((c: any) => c[this.field] === text);
        this.isMatch = item ? true : false;

        let result: any = {
          isMath: this.isMatch,
          item: item,
          value: text
        };

        if (this.ignoreText && this.ignoreText !== '') {
          let isIgnore = this.data.find((c: any) => c[this.field] === this.ignoreText);
          if(isIgnore){
            result.isMatch = true;
          }
        }

        this.output.emit(result);
      });
  }

  clear() {

  }
}
