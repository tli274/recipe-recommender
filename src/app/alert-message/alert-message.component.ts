import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AlertMessage, AlertType } from '../../Models/alert-message';

@Component({
  selector: 'app-alert-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-message.component.html',
  styleUrl: './alert-message.component.scss'
})
export class AlertMessageComponent {
  snackBarData: AlertMessage = inject(MAT_SNACK_BAR_DATA)

  setAlertType(type: AlertType) {
    if (type == AlertType.error) {
      return 'error'
    } else if (type == AlertType.warning) {
      return  'warning'
    } else if (type == AlertType.success) {
      return 'success'
    }
    return
  }
}
