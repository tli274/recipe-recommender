import { Component, inject } from '@angular/core';
import { MyUserInfo } from '../../Models/my-user-info';
import { PublicUserInfo } from '../../Models/public-user-info';
import { UsersApiService } from '../../Service/User/users-api.service';
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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { FriendType } from '../../Models/friend-type'
import { FriendResponse } from '../../Models/friend-response';
import { PendingResponse } from '../../Models/pending-response';
import { AddFriendDialogComponent } from '../add-friend-dialog/add-friend-dialog.component';
import { FriendshipManagementService } from '../../Service/User/friendship-management.service';
import { RecipeViewDetails } from '../../Models/recipe-view-details';

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
  friendTab: FriendType = FriendType.follows;
  // My Account Relationships
  myFollowsList: FriendResponse[] = [];
  myFollowersList: FriendResponse[] = [];
  myPendingList: PendingResponse[] = [];
  // Friends List
  followsList: FriendResponse[] = [];
  followersList: FriendResponse[] = [];
  pendingList: PendingResponse[] = [];

  lastClickedFriendNav: HTMLElement | null = null;

  // My recipes
  myRecipes: RecipeResponse[]= [];

  // Dialog Variables
  isDialogVisible: boolean = false;

  readonly dialog = inject(MatDialog);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersApiService, 
    private authService: AuthenticationService, 
    private friendshipService: FriendshipManagementService,
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
            if (this.isActiveUser()) {
              // Get User Recipes
              this.recipeManagementService.MyPostedRecipesObs.subscribe({
                next: (recipes) => {
                  this.myRecipes = recipes;
                },
                error: (err) => {
                  console.error(err);
                }
              })
              // Add Relationships
              this.friendshipService.AccountsIFollowObs.subscribe({
                next: (followedAccounts) => {
                  this.followsList = followedAccounts;
                },
                error: (err) => {
                  console.error(err)
                }
              })
              this.friendshipService.MyFollowersObs.subscribe({
                next: (followers) => {
                  this.followersList = followers;
                },
                error: (err) => {
                  console.error(err)
                }
              })
              this.friendshipService.PendingRequestsObs.subscribe({
                next: (pendingRequests)=> {
                  this.pendingList = pendingRequests;
                },
                error: (err)=> {
                  console.error(err)
                }
              })
            } else {
               this.recipeApiService.GetRecipeById(this.userid!).subscribe({
                next: (recipes) => {
                  this.myRecipes = recipes;
                },
                error: (err) => {
                  console.error(err);
                }
              })
            }
          },
          error: (err) => {
            console.log(err);
          }
        })
      }
    })

  }

  ngOnDestroy(){
    // Clean up subscriptions
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  getActiveUser(){
    let accessToken = this.authService.getAccessToken();
    let decodeToken = undefined;
    if (accessToken){
      decodeToken = this.authService.decodeToken(accessToken);
    } 
    return decodeToken.jti;
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
    const element = event.target as HTMLButtonElement;
    const navItems = document.querySelectorAll('.friend-nav-button') as NodeListOf<HTMLButtonElement>;
    navItems.forEach((item) => {
      item.classList.remove('active', 'disabled');
      item.disabled = false;
    })
    element.classList.add('active', 'disabled');
    element.disabled = true;
    this.friendTab = FriendType.follows; 
  }

  renderFollowers(event: Event) {
    const element = event.target as HTMLButtonElement;
    const navItems = document.querySelectorAll('.friend-nav-button') as NodeListOf<HTMLButtonElement>;
    navItems.forEach((item) => {
      item.classList.remove('active', 'disabled');
      item.disabled = false;
    })
    element.classList.add('active', 'disabled');
    element.disabled = true;
    this.friendTab = FriendType.followers;
  }

  renderPendingRequests(event: Event) {
    const element = event.target as HTMLButtonElement;
    const navItems = document.querySelectorAll('.friend-nav-button') as NodeListOf<HTMLButtonElement>;
    navItems.forEach((item) => {
      item.classList.remove('active', 'disabled');
      item.disabled = false;
    })
    element.classList.add('active', 'disabled');
    element.disabled = true;
    this.friendTab = FriendType.pending;
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
    let recipeModel: RecipeViewDetails = {
      recipe: recipe,
      activeUser: this.isActiveUser()
    }
    const dialogRef = this.dialog.open(RecipeViewComponent, {
      disableClose:true,
      data: recipeModel,
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

  goBackToMyself(){
    const userid = this.getActiveUser();
    this.router.navigate(['/user', userid])
  }

  AddNewFriend(){
    const dialogRef = this.dialog.open(AddFriendDialogComponent, {
      width: '80vw',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)
    })
  }

  test(test:any){
    console.log(test)
  }

}
