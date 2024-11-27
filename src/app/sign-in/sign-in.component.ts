import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../Service/User/users-api.service';
import { LoginDto } from '../../DTO/login-dto';
import { Login } from '../../Models/login';
import { AuthenticationService } from '../../Service/Authentication/authentication.service';
import { ShoppingCartService } from '../../Service/Shopping/shopping-cart.service';
import { MyPantryService } from '../../Service/Pantry/my-pantry.service';
import { ManageRecipeService } from '../../Service/Recipe/manage-recipe.service';
import { ReferenceService } from '../../Service/Reference/reference.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    FormsModule,
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
    private dialogRef: MatDialogRef<SignInComponent>,
    private authenticationService: AuthenticationService,
    private myPantryService: MyPantryService, 
    private myShoppingService: ShoppingCartService, 
    private referenceService: ReferenceService,
    private recipeManagementService: ManageRecipeService
    
  ){}

  public userLogin: Login = {
    username: "",
    password: ""
  };

  readonly dialog = inject(MatDialog);
  public errorMessage: string | null = null;

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

  loginUser(): void {
    // Convert model to dto
    const loginDto: LoginDto = {
      UserName: this.userLogin.username,
      Password: this.userLogin.password
    }
    this.authenticationService.LoginUser(loginDto).subscribe({
      next: (response) => {
        const token = response;
        this.authenticationService.storeToken(token.accessToken, token.refreshToken);
        this.myPantryService.initializePantry();
        this.myShoppingService.initializeShoppingCart();
        this.referenceService.initializeAllReferences();
        this.recipeManagementService.InitializeRecipeServices();
        this.errorMessage = null;
        this.closeDialog();
      },
      error: (err) => {
        this.errorMessage = err.error.error// remove brakets and error 
        console.log(err);
      }
    })
  }

  test() {
    this.authenticationService.getAccessToken();
  }

  logoutUser():void {
    this.authenticationService.logOut();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}


