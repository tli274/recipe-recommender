import { RouterModule, Routes } from '@angular/router';
import { IngredientComponent } from './ingredient/ingredient.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { MyPantryComponent } from './my-pantry/my-pantry.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { UserProfileComponent } from './user-profile/user-profile.component'

export const routes: Routes = [
    {
        path: 'grocery',
        title: 'grocery-page',
        component: IngredientComponent,
    },
    {
        path: 'my-pantry',
        title: 'my-pantry-page',
        component: MyPantryComponent,
    },
    {
        path: 'shopping-cart',
        title: 'shopping-cart-page',
        component: ShoppingCartComponent,
    },
    {
        path: 'user/:userid', 
        title: 'user-profile-page',
        component: UserProfileComponent,
    },
    {
        path: 'about',
        title: 'about-page',
        component: AboutPageComponent,
    },
    {
        path: '',
        redirectTo: 'grocery',
        pathMatch: 'full'
    }

];
