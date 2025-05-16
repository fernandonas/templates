import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.less']
})
export class WelcomeComponent implements OnInit {
  firstForm!: FormGroup;
  secondForm!: FormGroup;

  isValidForms = false;

  default = {
    nameControl: {
      validators: [Validators.required],
      disable: ['text', 'text2'],
      clear: ['text', 'text2']
    },
    textControl: {
      validators: [Validators.required],
      disable: ['text2'],
      clear: ['text2']
    },
    text2Control: {
      validators: [Validators.required, Validators.maxLength(2)],
      disable: [],
      clear: []
    }
  };

  firstGroup = {
    nameControl: {
      validators: [Validators.required],
      disable: ['text2'],
      clear: ['text2']
    },
    textControl: {
      validators: [],
      disable: ['text2'],
      clear: ['text2']
    },
    text2Control: {
      validators: [Validators.required],
      disable: [],
      clear: []
    }
  };
  template = new Map<number, any>([
    [1, this.default],
    [2, this.firstGroup]
  ]);

  get firstNameControl(): AbstractControl {
    return this.firstForm.get('name')!
  }

  get firstTextControl(): AbstractControl {
    return this.firstForm.get('text')!
  }

  get firstText2Control(): AbstractControl {
    return this.firstForm.get('text2')!
  }

  get secondNameControl(): AbstractControl {
    return this.secondForm.get('name')!
  }

  get secondTextControl(): AbstractControl {
    return this.secondForm.get('text')!
  }

  get secondText2Control(): AbstractControl {
    return this.secondForm.get('text2')!
  }

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
  }

  enableFirstForm(): void {
    const modal = this.template.get(1);
    this.firstForm = this.formBuilder.group({
      name: [{ value: null, disabled: false }, modal.nameControl.validators],
      text: [{ value: null, disabled: true }, modal.textControl.validators],
      text2: [{ value: null, disabled: true }, modal.text2Control.validators]
    });

    this.firstNameControl.valueChanges.subscribe({
      next: () => {
        this.enableTargetControlsIfCurrentControlValid(this.firstNameControl, this.getControlsByNames(modal.nameControl.disable, this.firstForm));
        this.clearTargetControlsIfCurrentControlInvaliod(this.firstNameControl, this.getControlsByNames(modal.nameControl.clear, this.firstForm));
      }
    });

    this.firstTextControl.valueChanges.subscribe({
      next: () => {
        this.enableTargetControlsIfCurrentControlValid(this.firstTextControl, this.getControlsByNames(modal.textControl.disable, this.firstForm));
        this.clearTargetControlsIfCurrentControlInvaliod(this.firstTextControl, this.getControlsByNames(modal.textControl.clear, this.firstForm));
      }
    });

    this.firstText2Control.valueChanges.subscribe({
      next: () => { }
    });

    this.firstForm.statusChanges.subscribe({
      next: () => {
        this.isValidForms = this.checkIfValidForms();
      }
    });
  }

  disableFirstForm(): void {
    this.firstForm = this.formBuilder.group({});
    this.isValidForms = this.checkIfValidForms();
  }

  enableSecondForm(): void {
    const modal = this.template.get(2);
    this.secondForm = this.formBuilder.group({
      name: [{ value: null, disabled: false }, modal.nameControl.validators],
      text: [{ value: null, disabled: true }, modal.textControl.validators],
      text2: [{ value: null, disabled: true }, modal.text2Control.validators]
    });

    this.secondNameControl.valueChanges.subscribe({
      next: () => {
        this.enableTargetControlsIfCurrentControlValid(this.secondNameControl, this.getControlsByNames(modal.nameControl.disable, this.secondForm));
        this.clearTargetControlsIfCurrentControlInvaliod(this.secondNameControl, this.getControlsByNames(modal.nameControl.clear, this.secondForm));
      }
    });

    this.secondTextControl.valueChanges.subscribe({
      next: () => {
        this.enableTargetControlsIfCurrentControlValid(this.secondTextControl, this.getControlsByNames(modal.textControl.disable, this.secondForm));
        this.clearTargetControlsIfCurrentControlInvaliod(this.secondTextControl, this.getControlsByNames(modal.textControl.clear, this.secondForm));
      }
    });

    this.secondText2Control.valueChanges.subscribe({
      next: () => {

      }
    });

    this.secondForm.statusChanges.subscribe({
      next: () => {
        this.isValidForms = this.checkIfValidForms();
      }
    });
  }

  disableSecondForm(): void {
    this.secondForm = this.formBuilder.group({})
    this.isValidForms = this.checkIfValidForms();
  }

  getControlsByNames(controlNames: string[], formGroup: FormGroup): AbstractControl[] {
    const abstractControls: AbstractControl[] = [];
    controlNames.map(control => {
      abstractControls.push(formGroup.get(control) as AbstractControl)
    })
    return abstractControls;
  }

  enableTargetControlsIfCurrentControlValid(currentControl: AbstractControl, targetControl: AbstractControl[]): void {
    const isCurrentControlValid = currentControl.valid;
    targetControl.forEach((control) => {
      isCurrentControlValid ?
        control.enable({ emitEvent: false }) :
        control.disable({ emitEvent: false })
    })
  }

  clearTargetControlsIfCurrentControlInvaliod(currentControl: AbstractControl, targetControl: AbstractControl[]): void {
    const isCurrentControlInvalid = currentControl.invalid;
    targetControl.forEach((control) => {
      if (isCurrentControlInvalid) {
        control.patchValue(null, { emitEvent: false })
      }
    })
  }

  checkIfValidForms(): boolean {
    const formGroups: FormGroup[] = [this.firstForm, this.secondForm];
    const activeFormGroups: FormGroup[] = [];
    formGroups.forEach(formGroup => {
      if (formGroup && Object.keys(formGroup.controls).length > 0) {
        activeFormGroups.push(formGroup)
      }
    })
    if (activeFormGroups.length == 0) {
      return false
    }
    return activeFormGroups.every(formGroup => formGroup.valid)
  }

}
