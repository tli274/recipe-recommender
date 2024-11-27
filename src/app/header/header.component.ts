import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SignInComponent } from '../sign-in/sign-in.component';
import { jwtDecode } from 'jwt-decode'
import { UsersService } from '../../Service/User/users-api.service';
import { AuthenticationService } from '../../Service/Authentication/authentication.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  title = "Local Chef"
  currentUser: string | null = null;

  readonly dialog = inject(MatDialog);
  public isLoggedIn: boolean;

  constructor(private authService: AuthenticationService) {
    this.isLoggedIn = authService.isLoggedIn();
  }

  // Move all of this to app-component 
  ngOnInit():void {
    // Subscribe to Services
    this.authService.loggedInStatus.subscribe(
      loginStatus => this.isLoggedIn = loginStatus
    );
  }

  ngOnDestroy(): void {
    this.authService.StopTokenRefreshTimer();
  }

  openDialog() {
    const dialogRef = this.dialog.open(SignInComponent, { 
      disableClose:true,
      width: '80%',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)
    })
  }

  logout(): void {
    this.authService.logOut();
    this.currentUser = null;
  }
}
