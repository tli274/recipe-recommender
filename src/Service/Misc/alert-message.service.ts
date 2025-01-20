import { inject, Injectable } from '@angular/core';
import { AlertMessage, AlertType } from '../../Models/alert-message';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertMessageComponent } from '../../app/alert-message/alert-message.component';

@Injectable({
  providedIn: 'root'
})
export class AlertMessageService {
  private durationInSeconds: number = 5
  private alertMessage = inject(MatSnackBar)

  constructor() { }

  openAlertMessage(data: AlertMessage) {
    let panelClass = '';
    if (data.type == AlertType.error)  {
      panelClass = 'error-alert';
    }
    else { // data.type == AlertType.success
      panelClass = 'success-alert'
    }
    this.alertMessage.openFromComponent(AlertMessageComponent, {
      data: {
        title: `${data.title}`,
        message: `${data.message}`,
        type: `${data.type}`
      },
      duration: this.durationInSeconds * 1000,
      verticalPosition: 'top',
      panelClass: panelClass
    })
  }
}
