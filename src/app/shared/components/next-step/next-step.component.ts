import { Component, VERSION, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";

@Component({
    selector: "app-next-step",
    templateUrl: "./next-step.component.html",
    styleUrls: ["./next-step.component.css"]
})
export class NextStepComponent {
    mainFormGroup!: FormGroup;
    firstFormGroup!: FormGroup;
    secondFormGroup!: FormGroup;
    formGroups!: FormGroup[];

    currentStep = 0;

    constructor(private _formBuilder: FormBuilder) { }

    ngOnInit() {
        this.mainFormGroup = this._formBuilder.group({
            formCount: 1,
            stepData: this._formBuilder.array([
                this._formBuilder.group({
                    name: ["", Validators.required]
                })
            ])
        });
        this.firstFormGroup = this._formBuilder.group({
            firstCtrl: ["", Validators.required]
        });
        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ["", Validators.required]
        });

        this.formGroups = this.getFormGroups();
    }

    addInput(currentIndex: any): void {
        const arrayControl = this.mainFormGroup.controls["stepData"] as FormArray;
        let newGroup = this._formBuilder.group({
            name: ["", Validators.required]
        });
        arrayControl.push(newGroup);
        const content = this;
        setTimeout((element: any) => {
            content.currentStep = currentIndex + 1;
        });
    }
    delInput(index: number): void {
        const arrayControl = this.mainFormGroup.controls["stepData"] as FormArray;
        arrayControl.removeAt(index);
    }

    getFormGroups() { 
        let formArray = this.mainFormGroup.get('stepData') as FormArray;
        let formGroups = formArray.controls as FormGroup[];
        console.log("formGroups", formGroups);
        return formGroups;
     }
}
