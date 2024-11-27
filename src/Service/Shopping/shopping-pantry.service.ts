import { Injectable } from '@angular/core';
import { ShoppingLists } from '../../Models/shopping-lists';
import { ShoppingItemRequestDto } from '../../DTO/RequestDto/shopping-item-request-dto';
import { ShoppingcartApiService } from './shopping-cart-api.service';
import { ShoppingCartService } from './shopping-cart.service';
import { MyPantryService } from '../Pantry/my-pantry.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingPantryService {
  // Handle the transfer between Shopping and Pantry List
  constructor(private shoppingApiService: ShoppingcartApiService, private myShoppingService: ShoppingCartService, private myPantryService: MyPantryService) { }

  CompleteCheckList(shoppingList: ShoppingLists) {
    // Filter list for selected items
    if (!shoppingList.shoppingListItems) return; // Give error empty shopping list 
    let requestList: ShoppingItemRequestDto[] = [];
    for (let item of shoppingList.shoppingListItems) {
      if (item.incart) {
        let request: ShoppingItemRequestDto = {
          listid: shoppingList.listid,
          ingredientid: item.ingredientid,
          priority: item.priority.priorityid,
          quantity: item.quantity,
          units: item.units.unitid,
          incart: true,
          notes: item.notes
        }
        requestList.push(request)
      }
    }
    this.shoppingApiService.CompleteShoppingList(shoppingList.listid, requestList).subscribe({
      next: (res) => {
        this.myShoppingService.CompleteCheckList(shoppingList.listid);
        this.myPantryService.CompleteShoppingList(requestList);
        console.log(res)
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
}
