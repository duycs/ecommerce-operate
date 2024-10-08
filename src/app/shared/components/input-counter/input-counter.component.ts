import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-counter',
  templateUrl: './input-counter.component.html',
  styleUrls: ['./input-counter.component.css'],
})
export class InputCounterComponent {

  // myFormGroup = new FormGroup({
  //   formField: new FormControl()
  // });

  _groupId: string = '';
  _id: string = '';
  _title: string = '';
  _value: number = 0;
  _step: number = 1;
  _min: number = 0;
  _max: number = Infinity;
  _wrap: boolean = false;
  color: string = 'default';

  @Output() outValue: any = new EventEmitter;

  @Input('value')
  set inputValue(_value: number) {
    this._value = this.parseNumber(_value);
  }

  @Input()
  set groupId(_groupId: string) {
    this._groupId = _groupId;
  }

  @Input()
  set id(_id: string) {
    this._id = _id;
  }

  @Input()
  set title(_title: string) {
    this._title = _title;
  }

  @Input()
  set step(_step: number) {
    this._step = this.parseNumber(_step);
  }

  @Input()
  set min(_min: number) {
    this._min = this.parseNumber(_min);
  }

  @Input()
  set max(_max: number) {
    this._max = this.parseNumber(_max);
  }

  @Input()
  set wrap(_wrap: boolean) {
    this._wrap = this.parseBoolean(_wrap);
  }

  private parseNumber(num: any): number {
    return +num;
  }

  private parseBoolean(bool: any): boolean {
    return !!bool;
  }

  setColor(color: string): void {
    this.color = color;
  }

  getColor(): string {
    return this.color
  }

  incrementValue(step: number = 1): void {

    let inputValue = this._value + step;

    if (this._wrap) {
      inputValue = this.wrappedValue(inputValue);
    }

    this._value = inputValue;

    let outValue = {
      groupId: this._groupId,
      id: this._id,
      value: this._value
    }

    this.outValue.emit(outValue);
  }

  private wrappedValue(inputValue: any): number {
    if (inputValue > this._max) {
      return this._min + inputValue - this._max;
    }

    if (inputValue < this._min) {

      if (this._max === Infinity) {
        return 0;
      }

      return this._max + inputValue;
    }

    return inputValue;
  }

  shouldDisableDecrement(inputValue: number): boolean {
    return !this._wrap && inputValue <= this._min;
  }

  shouldDisableIncrement(inputValue: number): boolean {
    return !this._wrap && inputValue >= this._max;
  }

  change(){
    console.log("change");
    
    let outValue = {
      groupId: this._groupId,
      id: this._id,
      value: this._value
    }

    this.outValue.emit(outValue);
  }
}
