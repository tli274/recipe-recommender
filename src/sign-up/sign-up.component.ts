import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SignInComponent } from '../sign-in/sign-in.component';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [    
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SignUpComponent {
  userForm: FormGroup = new FormGroup({
    username: new FormControl<string>('', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]),
    email: new FormControl<string>('', [Validators.required, Validators.email, Validators.maxLength(255)]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]),
    confirmPassword: new FormControl<string>('',[Validators.required])
  }, {
    validators: [this.passwordMatchValidator]
  })
  hide = true

  // Fields for error message
  userErrorMessage = signal('')
  emailErrorMessage = signal('')
  passwordErrorMessage = signal('')
  confirmPasswordErrorMessage = signal('')  


  constructor(
    private dialogRef: DialogRef<SignUpComponent>,
  ){

  }
  readonly dialog = inject(MatDialog);

  errorMessage = signal('');


  openSignIn(): void {
    this.dialogRef.close();

    const dialogRef = this.dialog.open(SignInComponent, {
      disableClose:true,
      width: '80%',
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)
    })
  }
  // Form Field Validation Methods
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : {passwordMismatch: true};
  }

  updateUserErrorMessage():void {
    if (this.userForm.controls['username'].hasError('required')) {
      this.userErrorMessage.set('Username cannot be empty')
    } else if (this.userForm.controls['username'].hasError('minlength')) {
      this.userErrorMessage.set('Username needs to be at least 5 characters')
    } else if (this.userForm.controls['username'].hasError('maxlength')) {
      this.userErrorMessage.set('Username is too long. Needs to be between 5 and 32 characters')
    } else {
      this.userErrorMessage.set('')
    }
  }

  updateEmailErrorMessage():void{
    if (this.userForm.controls['email'].hasError('required')) {
      this.emailErrorMessage.set('Email cannot be empty');
    } else if (this.userForm.controls['email'].hasError('email')) {
      this.emailErrorMessage.set('Not a valid email');
    } else if (this.userForm.controls['email'].hasError('maxlength')) {
        this.emailErrorMessage.set('What email do you have is over 255 character long?')
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updatePasswordErrorMessage():void {
    if (this.userForm.controls['password'].hasError('required')) {
      this.passwordErrorMessage.set('Password cannot be empty')
    } else if (this.userForm.controls['password'].hasError('minlength')) {
      this.passwordErrorMessage.set('Your password needs to be at least 8 characters')
    } else if (this.userForm.controls['password'].hasError('maxlength')) {
      this.passwordErrorMessage.set('Password is too long. Needs to be between 8-32 characters')
    } else {
      this.passwordErrorMessage.set('')
    }
  }

  updateConfirmPasswordErrorMessage():void {
    if (this.userForm.controls['confirmPassword'].hasError('required')) {
      this.confirmPasswordErrorMessage.set('This field cannot be empty')
    } else if (this.userForm.hasError('passwordMismatch')) {
      this.confirmPasswordErrorMessage.set('The passwords are not the same')
    } else {
      this.confirmPasswordErrorMessage.set('')
    }
  }

  onSubmit() {

  }
}
