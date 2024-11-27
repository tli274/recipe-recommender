import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ConfirmationMessage } from '../../Models/confirmation-message';
import { InjectSetupWrapper } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-message',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatDialogTitle, MatDialogContent],
  templateUrl: './confirmation-message.component.html',
  styleUrl: './confirmation-message.component.scss'
})
export class ConfirmationMessageComponent {
  confirmationMessage: ConfirmationMessage = inject(MAT_DIALOG_DATA);

  constructor(
    private dialogRef: MatDialogRef<ConfirmationMessageComponent>,
  ){}
  
  onCancel():void {
    console.log(this.confirmationMessage)
    this.dialogRef.close(false)
  }

  onConfirm():void {
    this.dialogRef.close(true);
  }
}
