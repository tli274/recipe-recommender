import { Component, inject } from '@angular/core';
import { MyUserInfo } from '../../Models/my-user-info';
import { PublicUserInfo } from '../../Models/public-user-info';
import { UsersService } from '../../Service/User/users-api.service';
import { AuthenticationService } from '../../Service/Authentication/authentication.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ShoppingListItems } from '../../Models/shopping-lists';
import { ShoppingItemComponent } from '../shopping-item/shopping-item.component';
import { MatDialog } from '@angular/material/dialog';
import { EditUserProfileComponent } from '../edit-user-profile/edit-user-profile.component';
import { RecipeApiService } from '../../Service/Recipe/recipe-api.service';
import { RecipeResponse } from '../../DTO/ResponseDto/recipe-response';
import { RecipeViewComponent } from '../recipe-view/recipe-view.component';
import { EditRecipeComponent } from '../edit-recipe/edit-recipe.component';
import { ManageRecipeService } from '../../Service/Recipe/manage-recipe.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { FriendType } from '../../Models/friend-type'

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatSidenavModule, MatIconModule,
     MatButtonModule, MatTooltipModule, 
     MatFormFieldModule, MatInputModule, 
     RecipeViewComponent,
     RouterModule
    ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})


export class UserProfileComponent {
  // userid 
  userid: string | null = null;

  // Route Subscription
  routeSubscription!: Subscription;

  // Should always be myUserInfo
  userData: MyUserInfo | PublicUserInfo | null = null;

  // Friend Nav
  FriendType = FriendType;
  friendTab: FriendType = FriendType.followers;
  friendsList: any;
  lastClickedFriendNav: HTMLElement | null = null;

  // My recipes
  myRecipes: RecipeResponse[]= [];

  // Dialog Variables
  isDialogVisible: boolean = false;

  readonly dialog = inject(MatDialog);

  constructor(
    private route: ActivatedRoute,
    private userService: UsersService, 
    private authService: AuthenticationService, 
    private recipeManagementService: ManageRecipeService,
    private recipeApiService: RecipeApiService){
  }

  ngOnInit(){
    // Get user data
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.userid = params.get('userid');
      if (this.userid) {
        this.userService.GetUserInfo(this.userid).subscribe({
          next: (response) => {
            this.userData = response
            // Get User Recipes
            if (this.isActiveUser()) {
              this.recipeManagementService.MyPostedRecipesObs.subscribe({
                next: (recipes) => {
                  this.myRecipes = recipes;
                },
                error: (err) => {
                  console.error(err);
                }
              })
            } else {
              if (this.userid) { // I'm not sure why this is needed but it prevents an error
                this.recipeApiService.GetRecipeById(this.userid).subscribe({
                  next: (recipes) => {
                    this.myRecipes = recipes;
                  },
                  error: (err) => {
                    console.error(err);
                  }
                })
              } else {
                console.error("No userid. Page error")
              }
            }
          },
          error: (err) => {
            console.log(err);
          }
        })
      }
    })
    // Get list of followed accounts
    this.userService.GetFollowedAccounts().subscribe({
      next: (response) => {
        this.friendsList = response;
        // set nav on success
        const firstNavItem = document.querySelector('.friend-nav-button') as HTMLButtonElement;
        if (firstNavItem) {
          firstNavItem.classList.add('active', 'disabled');
          firstNavItem.disabled = true;
        }
        console.log(this.friendsList);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  ngOnDestroy(){
    // Clean up subscriptions
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  isActiveUser(): boolean{
    if (this.userData) {
      let accesToken = this.authService.getAccessToken();
      let decodedToken = undefined;
      if (accesToken) {
        decodedToken = this.authService.decodeToken(accesToken);
      };
      if (this.userid == decodedToken.jti) {
        return true;
      }
    }
    return false;
  }

  // Render friends list
  renderFollowedAccounts(event: Event) {
    this.userService.GetFollowedAccounts().subscribe({
      next: (response) => {
        this.friendsList = response;
        const element = event.target as HTMLButtonElement;
        const navItems = document.querySelectorAll('.friend-nav-button') as NodeListOf<HTMLButtonElement>;
        navItems.forEach((item) => {
          item.classList.remove('active', 'disabled');
          item.disabled = false;
        })
        element.classList.add('active', 'disabled');
        element.disabled = true;
        this.friendTab = FriendType.followed;
        console.log(this.friendsList)
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  renderFollowers(event: Event) {
    this.userService.GetFollowers().subscribe({
      next: (response) => {
        this.friendsList = response;
        const element = event.target as HTMLButtonElement;
        const navItems = document.querySelectorAll('.friend-nav-button') as NodeListOf<HTMLButtonElement>;
        navItems.forEach((item) => {
          item.classList.remove('active', 'disabled');
          item.disabled = false;
        })
        element.classList.add('active', 'disabled');
        element.disabled = true;
        this.friendTab = FriendType.followers;
        console.log(this.friendsList)
      },
      error: (err) => {
        console.log(err);
      }
    })  
  }

  renderPendingRequests(event: Event) {
    this.userService.GetPendingRequest().subscribe({
      next: (response) => {
        this.friendsList = response;
        const element = event.target as HTMLButtonElement;
        const navItems = document.querySelectorAll('.friend-nav-button') as NodeListOf<HTMLButtonElement>;
        navItems.forEach((item) => {
          item.classList.remove('active', 'disabled');
          item.disabled = false;
        })
        element.classList.add('active', 'disabled');
        element.disabled = true;
        this.friendTab = FriendType.pending;
        console.log(this.friendsList)
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  EditProfileInfo(){
    const dialogRef = this.dialog.open(EditUserProfileComponent, {
      disableClose:true,
      data: this.userData,
      width: '80%',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)
    })
  }

  // Recipe Dialog Box
  OpenRecipeView(recipe: RecipeResponse) {
    const dialogRef = this.dialog.open(RecipeViewComponent, {
      disableClose:true,
      data: recipe,
      width: '80vw',
      maxWidth: '100vw',
      height: '80vh'
    })
  }

  AddNewRecipeDialog() {
    const dialogRef = this.dialog.open(EditRecipeComponent, {
      disableClose:true,
      width: '80vw',
      maxWidth: '100vw',
      height: '80vh'
    })
  }

  test(test:any){
    console.log(test)
  }

}
