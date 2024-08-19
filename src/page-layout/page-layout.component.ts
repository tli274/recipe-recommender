import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatIconModule, MatIconRegistry } from '@angular/material/icon'
import { IngredientComponent } from '../ingredient/ingredient.component';
import { RecipeLayoutComponent } from '../recipe-layout/recipe-layout.component';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip'

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [RouterModule, MatSidenavModule, MatListModule, MatIconModule, MatTooltipModule, IngredientComponent, RecipeLayoutComponent],
  templateUrl: './page-layout.component.html',
  styleUrl: './page-layout.component.scss'
})
export class PageLayoutComponent {
  constructor(iconRegistry: MatIconRegistry) {
    
  }
}
