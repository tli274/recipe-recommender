import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-recipe-layout',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './recipe-layout.component.html',
  styleUrl: './recipe-layout.component.scss'
})
export class RecipeLayoutComponent {

}
