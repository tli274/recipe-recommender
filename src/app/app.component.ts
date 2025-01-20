import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { IngredientComponent } from './ingredient/ingredient.component';
import { PageLayoutComponent } from './page-layout/page-layout.component'
import { MyPantryService } from '../Service/Pantry/my-pantry.service';
import { ShoppingCartService } from '../Service/Shopping/shopping-cart.service';
import { ReferenceService } from '../Service/Reference/reference.service';
import { ManageRecipeService } from '../Service/Recipe/manage-recipe.service';
import { AuthenticationService } from '../Service/Authentication/authentication.service';
import { tokenDto } from '../DTO/token-dto';
import { FriendshipManagementService } from '../Service/User/friendship-management.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, IngredientComponent, PageLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'recipe-recommender';
  constructor(
    private authService: AuthenticationService,
    private myPantryService: MyPantryService, 
    private myShoppingService: ShoppingCartService, 
    private referenceService: ReferenceService,
    private recipeManagementService: ManageRecipeService,
    private friendshipManagement: FriendshipManagementService,
  ){
  }

  ngOnInit():void {
    this.authService.RequestNewAccessToken().subscribe({
      next: (response: tokenDto) => {
        this.authService.storeToken(response.accessToken, response.refreshToken);
        this.referenceService.initializeAllReferences();
        this.myPantryService.initializePantry();
        this.myShoppingService.initializeShoppingCart();
        this.recipeManagementService.InitializeRecipeServices();
        this.authService.StartTokenRefreshTimer();
        this.friendshipManagement.InitializeAllRelationships();
      },
      error: (err) => {
        console.log(err); 
      }
    })
  }

  ngOnDestroy(){
    this.authService.StopTokenRefreshTimer();
  }
}
