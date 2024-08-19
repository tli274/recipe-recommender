import { Component, inject, model } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  constructor(
    private dialogRef: MatDialogRef<SignInComponent>
  ){}

  readonly dialog = inject(MatDialog);

  openSignUp(): void {
    this.dialogRef.close();

    const dialogRef = this.dialog.open(SignUpComponent, {
      disableClose:true,
      width: '80%',
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)
    })
  }
}
