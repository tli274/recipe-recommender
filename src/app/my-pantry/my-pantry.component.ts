import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-my-pantry',
  standalone: true,
  imports: [MatTabsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './my-pantry.component.html',
  styleUrl: './my-pantry.component.scss'
})
export class MyPantryComponent {
  links = ['Shopping List 1']
  activeLink = this.links[0];

  addLink(){
    this.links.push(`Shopping List ${this.links.length+1}`);
  }

}
