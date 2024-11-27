import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatFormFieldModule } from '@angular/material/form-field' 
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Ingredient } from '../../Models/ingredient';
import { FoodGroups } from '../../Models/food-groups';
import { PantryApiService } from '../../Service/Pantry/pantry-api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pantry',
  standalone: true,
  imports: [MatSidenavModule, MatFormFieldModule, 
    MatInputModule, MatCardModule, MatButtonModule],
  templateUrl: './ingredient.component.html',
  styleUrl: './ingredient.component.scss'
})
export class IngredientComponent {
  // More fake data
  pantryItems: Ingredient[] = [
  ]
  
  constructor(private foodGroups: PantryApiService) {

  }

  // Handles tabs for differing food groups
  tabs: FoodGroups[] = []

  ngOnInit() {
    this.initializeCards();
  }

  toggleContent(index: number) {
    let toggledTab = this.tabs.find(tab=>tab.foodGroupId == index);
    if (toggledTab) toggledTab.visibility = !toggledTab.visibility;
  }

  initializeCards() {
    this.foodGroups.GetFoodGroupWithPantryItem().subscribe({
      next: (data: FoodGroups[]) => {
        this.tabs = data;
        console.log(data)
      },
      error: (err) => {
        console.error("Error loading food groups and ingredients: ", err);
      }
    });
  }

}
