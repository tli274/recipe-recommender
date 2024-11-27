import { Injectable } from '@angular/core';
import { ShoppingListItems, ShoppingLists } from '../../Models/shopping-lists';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShoppingcartApiService } from './shopping-cart-api.service';
import { ShoppingItemRequestDto } from '../../DTO/RequestDto/shopping-item-request-dto';
import { ShoppingListRequestDto } from '../../DTO/RequestDto/shopping-list-request-dto';
import { UpdateListNameRequestDto } from '../../DTO/RequestDto/update-list-name-request-dto';
import { FoodGroups } from '../../Models/food-groups';
import { PantryApiService } from '../Pantry/pantry-api.service';
import { Units } from '../../Models/units';
import { Priority } from '../../Models/priority';
import { ReferenceService } from '../Reference/reference.service';
import { UpdateCheckListRequestDto } from '../../DTO/RequestDto/update-checklist-request-dto';
import { ShoppingItemCheckList } from '../../Models/shopping-item-checks';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private shoppingApiService: ShoppingcartApiService, private pantryApiService: PantryApiService, private referenceService: ReferenceService) { }

  // Ingredient List
  listOfFoodGroups: FoodGroups[] = [];

  // Checklist to Update
  private logchecklist: Map<number, boolean>[] = [];
  private checklistChanges: UpdateCheckListRequestDto[] = []

  // Reference List
  units: Units[] = [];
  priority: Priority[] = [];

  // Shopping List
  private shoppinglinks: ShoppingLists[] = [];
  private publicShoppingList: BehaviorSubject<ShoppingLists[]> = new BehaviorSubject<ShoppingLists[]>([]);
  public publicShoppingListObs: Observable<ShoppingLists[]> = this.publicShoppingList.asObservable();
  
  // Total
  private totalSubject: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public totalObs: Observable<number[]> = this.totalSubject.asObservable();

  initializeShoppingCart(){
    this.shoppingApiService.GetShoppingCartService().subscribe({
      next: (shoppingList: ShoppingLists[]) => {
        for (let list of shoppingList) {
          list.isediting = false;
          // Calculate total
          let listTotal: number = 0;
          if (list.shoppingListItems) {
            for (let product of list.shoppingListItems) {
              if (product.price && product.quantity) listTotal += (product.price * product.quantity);
            }
          }
          list.total = listTotal;
          // Set up empty lists
          this.logchecklist.push(new Map<number, boolean>())
        }
        this.shoppinglinks = shoppingList;
        this.publicShoppingList.next(this.shoppinglinks);
      },
      error: (err) => {
        console.error(err)
      }
    })
    this.publicShoppingList.next(this.shoppinglinks);
    // Get Food Group List
    // Seperate this to a seperate service (see my-pantry-service)
    this.pantryApiService.GetFoodGroupWithPantryItem().subscribe({
      next: (foodgroups: FoodGroups[]) => {
        this.listOfFoodGroups = foodgroups;
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  addShoppingLink(){
    let newLisst: ShoppingListRequestDto = {
      iscompleted: false,
      listname: `Shopping List ${this.shoppinglinks.length}`,
      listid: 0,
      createddate: new Date(),
      notes: '',
      completiondate: undefined,
    }
    this.shoppingApiService.AddShoppingList(newLisst).subscribe({
      next: (shoppingList: ShoppingLists) => {
        shoppingList.isediting = false;
        shoppingList.shoppingListItems = [];
        shoppingList.total = 0;
        this.logchecklist.push(new Map<number, boolean>());
        this.shoppinglinks.push(shoppingList)
        this.publicShoppingList.next(this.shoppinglinks)
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  updateListName(shoppingList: ShoppingLists){
    var listNameDto: UpdateListNameRequestDto = {
      listid: shoppingList.listid,
      listname: shoppingList.listname
    }
    this.shoppingApiService.UpdateListName(listNameDto).subscribe({
      next: () => {
        this.shoppinglinks.find(sl => sl.listid == shoppingList.listid)
        this.publicShoppingList.next(this.shoppinglinks);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  deleteShoppingLink(listid: number){
    this.shoppingApiService.DeleteShoppingList(listid).subscribe({
      next: (noContent) => {
        const index = this.shoppinglinks.findIndex(sl => sl.listid == listid);
        this.shoppinglinks.splice(index, 1);
        this.publicShoppingList.next(this.shoppinglinks)
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  AddShoppingItem(ingredientName: string, listid: number ) {
    // Check if ingredient is valid
    let validIngredient = null;
    for (const foodGroup of this.listOfFoodGroups) {
      validIngredient = foodGroup.ingredients.find(ingredient => {
        return ingredient.ingredientname == ingredientName;
      })
      if (validIngredient) break;
    }
    if (validIngredient == null) throw new Error("Invalid Ingredient");

    // Check if ingredient already in shopping cart
    const currListIndex = this.shoppinglinks.findIndex(sl => sl.listid === listid);
    if (currListIndex == null || currListIndex == -1) return;
    const ingredient = this.shoppinglinks[currListIndex].shoppingListItems?.find(sli => sli.ingredientname === ingredientName);
    if (ingredient != null) {
      return; // Highlight ingredient to show it exist already
    }
    let newitem: ShoppingItemRequestDto = {
      listid: listid,
      ingredientid: validIngredient.ingredientid,
      quantity: 1,
      priority: 1,
      units: 1,
      incart: false,
      notes: ''
    } 
    this.shoppingApiService.AddShoppingItem(newitem).subscribe({
      next: (item: ShoppingListItems) => {
        let defaultUnit: Units = {
          unitid: 1,
          unitname: "cnt"
        }
        let defaultPriority: Priority = {
          priorityid: 1,
          prioritydesc: "None"
        }
        let shoppingItem: ShoppingListItems = {
          ingredientid: validIngredient.ingredientid,
          ingredientname: validIngredient.ingredientname,
          price: 0,
          quantity: 1,
          units: defaultUnit,
          priority: defaultPriority,
          incart: false,
          notes: newitem.notes
        }
        this.shoppinglinks[currListIndex].shoppingListItems?.push(shoppingItem)
        this.publicShoppingList.next(this.shoppinglinks)
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
  
  UpdateShoppingItem(shoppingItem: ShoppingItemRequestDto){
    const currListIndex = this.shoppinglinks.findIndex(sl => sl.listid === shoppingItem.listid);
    if (currListIndex == undefined || currListIndex == -1) return;
    const itemIndex = this.shoppinglinks[currListIndex].shoppingListItems?.findIndex(sli => sli.ingredientid === shoppingItem.ingredientid);
    if (itemIndex == undefined || itemIndex == -1) {
      return; // Replace these returns with errors
    }
    this.shoppingApiService.UpdateShoppingItem(shoppingItem).subscribe({
      next: (res: ShoppingListItems) => {
        if (this.shoppinglinks[currListIndex].shoppingListItems == undefined) {
          throw new Error("Shopping list has no items")
        }
        // Calc new total
        let oldItemPrice = this.shoppinglinks[currListIndex].shoppingListItems![itemIndex].price
        let oldItemQuantity = this.shoppinglinks[currListIndex].shoppingListItems![itemIndex].quantity
        if (oldItemPrice!=undefined && oldItemQuantity!=undefined && res.price!=undefined && res.quantity!=undefined) {
          this.shoppinglinks[currListIndex].total += (res.price * res.quantity)-(oldItemPrice * oldItemQuantity);
        }
        
        this.shoppinglinks[currListIndex].shoppingListItems![itemIndex].notes = res.notes
        this.shoppinglinks[currListIndex].shoppingListItems![itemIndex].incart = res.incart
        this.shoppinglinks[currListIndex].shoppingListItems![itemIndex].price = res.price;
        this.shoppinglinks[currListIndex].shoppingListItems![itemIndex].quantity = res.quantity;
        this.shoppinglinks[currListIndex].shoppingListItems![itemIndex].priority.priorityid = shoppingItem.priority; // Bypass potential null, look into api changes 
        this.shoppinglinks[currListIndex].shoppingListItems![itemIndex].units.unitid = shoppingItem.units;
        this.shoppinglinks[currListIndex].shoppingListItems![itemIndex].priority.prioritydesc = res.priority.prioritydesc;
        this.shoppinglinks[currListIndex].shoppingListItems![itemIndex].units.unitname = res.units.unitname;

        this.publicShoppingList.next(this.shoppinglinks);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  LogChangesToCheckList(listid:number, ingredientCheckList: ShoppingItemCheckList) {
    let index = this.shoppinglinks.findIndex(list => list.listid === listid)
    if (index == undefined) return; // Create list error 
    this.logchecklist[index].set(ingredientCheckList.ingredientid, ingredientCheckList.incart);
  }

  UpdateCheckList(listid: number) {
    let index = this.shoppinglinks.findIndex(list => list.listid === listid)
    if (index == -1 || index == undefined) return;
    let itemsToUpdate: UpdateCheckListRequestDto[] = [];
    for (let [key, value] of this.logchecklist[index]) 
    {
      let dtoRequest: UpdateCheckListRequestDto = {
        ingredientid: key,
        incart: value
      }
      itemsToUpdate.push(dtoRequest);
    }
    this.shoppingApiService.UpdateCheckList(listid, itemsToUpdate).subscribe({
      next: () => {
        this.logchecklist[index].clear();
      },
      error: (err)=> {
        console.error(err)
      }
    });
  }

  CompleteCheckList(listid: number) {
    let listIndex = this.shoppinglinks.findIndex(sl => sl.listid == listid);
    this.shoppinglinks[listIndex].iscompleted = true;
    this.shoppinglinks[listIndex].completiondate = new Date();
    this.publicShoppingList.next(this.shoppinglinks);
  }

  DeleteShoppingItem(listid: number, ingredientid: number) {
    const currListIndex = this.shoppinglinks.findIndex(sl => sl.listid === listid);
    if (currListIndex == undefined || currListIndex == -1) return;
    const itemIndex = this.shoppinglinks[currListIndex].shoppingListItems?.findIndex(sli => sli.ingredientid === ingredientid);
    if (itemIndex == undefined || itemIndex == -1) {
      return; // Replace these returns with errors
    }
    this.shoppingApiService.DeleteShoppingItem(listid, ingredientid).subscribe({
      next: (NoReponse) => {
        let oldItemPrice = this.shoppinglinks[currListIndex].shoppingListItems![itemIndex].price
        let oldItemQuantity = this.shoppinglinks[currListIndex].shoppingListItems![itemIndex].quantity
        if (oldItemPrice && oldItemQuantity) {
          this.shoppinglinks[currListIndex].total -= (oldItemPrice * oldItemQuantity)
        }

        this.shoppinglinks[currListIndex].shoppingListItems?.splice(itemIndex, 1)
        this.publicShoppingList.next(this.shoppinglinks)
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

}
