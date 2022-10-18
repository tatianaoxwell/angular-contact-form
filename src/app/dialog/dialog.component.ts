import { Component, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormControl,
	FormGroup,
	ValidationErrors,
	ValidatorFn,
	Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  signupForm!: FormGroup;
  ratingMessage: string = '';
 
  private validationMessages: any = {
	required: 'Rating is <strong>required</strong>.',
	ratingValidator: 'Please enter a valid rating between 1 and 5.'
  }
  constructor(private router: Router ) {}

  get firstNameCtrl(): FormControl {
    return this.signupForm.controls['firstName'] as FormControl;
  }
  get lastNameCtrl(): FormControl {
    return this.signupForm.controls['lastName'] as FormControl;
  }
  get emailGroupCtrl(): FormGroup {
    return this.signupForm.controls['emailGroupCtrl'] as FormGroup;
  }
  get emailCtrl(): FormControl {
    return this.emailGroupCtrl.controls['email'] as FormControl;
  }
  get confirmEmailCtrl(): FormControl {
    return this.emailGroupCtrl.controls['confirmEmail'] as FormControl;
  }
  get mobileNumberCtrl(): FormControl {
    return this.signupForm.controls['mobileNumber'] as FormControl;
  }
  get notificationCtrl(): FormControl {
    return this.signupForm.controls['notification'] as FormControl;
  }
  get ratingCtrl(): FormControl {
    return this.signupForm.controls['rating'] as FormControl;
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      emailGroup: new FormGroup(
        {
          email: new FormControl('', [Validators.required, Validators.email]),
          confirmEmail: new FormControl('', [Validators.required]),
        },
        [this.emailValidator]
      ),
      mobileNumber: new FormControl(''),
      notification: new FormControl('email'),
      rating: new FormControl(null, [
        Validators.required,
        this.validateRatingMinMax(1, 5),
      ]),
      sendCatalog: new FormControl(true),
    });

    this.listenForNotificationChange().subscribe();
  }

  listenForNotificationChange(): Observable<string> {
    return this.notificationCtrl.valueChanges.pipe(
      tap((result: string) => {
        console.log(result, this.notificationCtrl);
        this.setValidation(result);
      })
    );
  }

  setValidation(result: string): void {
    if (result === 'text') {
      this.mobileNumberCtrl.setValidators(Validators.required);
      this.emailCtrl.clearValidators();
    } else {
      this.mobileNumberCtrl.clearValidators();
    }

    this.mobileNumberCtrl.updateValueAndValidity();
  }

  setMessage(c: AbstractControl): void {
	this.ratingMessage = '';
	if((c.touched || c.dirty) && c.errors) {
		this.ratingMessage = Object.keys(c.errors).map(
			key => this.validationMessages[key]
		).join('');
	}
  }
  emailValidator(c: AbstractControl): ValidationErrors | null {
	const emailCtrl = c.get('email') as FormControl;
	const confirm = c.get('confirmEmail');
    if (emailCtrl?.value !== confirm?.value) {
		// confirm?.getError();
		confirm?.setErrors({ emailValidator: true });
      return { emailValidator: true };
    }

	
	if(emailCtrl.pristine || confirm?.pristine) {
    return null;
	}
	confirm?.setErrors(null);
	return null;
  }

  validateRatingMinMax(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      if (
        c.value !== null &&
        (isNaN(c.value) ||
          c.value > max ||
          c.value < min)
      ) {
        return { ratingValidator: true };
      }

      return null;
    };
  }

  //   ratingValidator(ratingCtrl: AbstractControl): ValidationErrors|null {
  // 	if (ratingCtrl.value !== null && (isNaN(ratingCtrl.value) || ratingCtrl.value > 5 || ratingCtrl.value < 1)) {
  //     return {'ratingValidator': true};
  // 	}
  // 		return null;
  //   }
  onClose() {
	// this.router.navigate();
  }

  onSave() {}
}
