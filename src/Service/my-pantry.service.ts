import { Injectable } from '@angular/core';
import { MyPantryItem } from '../Models/my-pantry-item';

@Injectable({
  providedIn: 'root'
})
export class MyPantryService {

  private myPantry: Map<number, MyPantryItem> = new Map();

  constructor() { }
  
  getPantry(): MyPantryItem[] {
    return Array.from(this.myPantry.values());
  }

  addIngredient(ingredient: MyPantryItem): void {
    // Check if its in pantry. If so, add to quantity instead
    const element = this.myPantry.get(ingredient.id)
    if (element) {
      element.quantity++;
    } else {
      this.myPantry.set(ingredient.id, ingredient);
    }
  }

  removeItemById(id: number): void {
    
  }

  removeItemByName(name: string): void {

  }
}
