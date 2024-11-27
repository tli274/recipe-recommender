import { Injectable } from '@angular/core';
import { MyPantryItem } from '../../Models/my-pantry-item';
import { PantryItemsFG } from '../../Models/pantry-items-fg';
import { PantryApiService } from './pantry-api.service';
import { PantryListResponse } from '../../Models/pantry-list-response';
import { Ingredient, IngredientsWithPantryDetails } from '../../Models/ingredient';
import { FoodGroups } from '../../Models/food-groups';
import { formatNumber } from '@angular/common';
import { Units } from '../../Models/units';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShoppingListRequestDto } from '../../DTO/RequestDto/shopping-list-request-dto';
import { ShoppingItemRequestDto } from '../../DTO/RequestDto/shopping-item-request-dto';
import { ReferenceService } from '../Reference/reference.service';
import { UpdatePantryItemRequestDto } from '../../DTO/RequestDto/update-pantry-dto';

@Injectable({
  providedIn: 'root'
})
export class MyPantryService {

  private myPantryListGroupByFoodId: PantryItemsFG[] = [];
  listOfFoodGroups: FoodGroups[] = [];
  // Behavior Subject
  myPantryList: BehaviorSubject<PantryItemsFG[]> = new BehaviorSubject<PantryItemsFG[]>([]);
  myPantryListObs: Observable<PantryItemsFG[]> = this.myPantryList.asObservable(); 

  // Reference
  unitMap: Map<number, string> = new Map<number, string>();

  constructor(private pantryApiService: PantryApiService, private referenceService: ReferenceService) { }

  // Call api to initialize pantry
  initializePantry() {
    // Initialize my pantry items
    this.pantryApiService.GetMyPantryItems().subscribe({
      next: (pantryList: PantryListResponse[]) => {
        this.myPantryListGroupByFoodId = this.mapToNewStructure(pantryList)
        this.myPantryList.next(this.myPantryListGroupByFoodId);
      },
      error: (err) => {
        console.error(err)
      }
    })
    // Get Food Group List
    // Seperate this to a seperate service (see shopping-cart-service)
    this.pantryApiService.GetFoodGroupWithPantryItem().subscribe({
      next: (foodgroups: FoodGroups[]) => {
        this.listOfFoodGroups = foodgroups;
      },
      error: (err) => {
        console.error(err)
      }
    })
    // Get Units
    this.referenceService.getUnitsMap().subscribe({
      next: (unitMap: Map<number, string>) => {
        this.unitMap = unitMap;
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  getPantryItems(): PantryItemsFG[] {
    return this.myPantryList.getValue();
  }

  addItemToPantry(newPantryItem: UpdatePantryItemRequestDto) {
    // Check if ingredient is valid
    let validIngredient = null;
    for (const foodGroup of this.listOfFoodGroups) {
      validIngredient = foodGroup.ingredients.find(ingredient => {
        return ingredient.ingredientid == newPantryItem.ingredientid;
      })
      if (validIngredient) break;
    }
    if (validIngredient == null) return;

    // Check if ingredient already in pantry
    let inPantryIngredient = null;
    for (const foodGroup of this.myPantryListGroupByFoodId) {
      inPantryIngredient = foodGroup.ingredients.find(ingredient => {
        return ingredient.ingredientid == newPantryItem.ingredientid;
      })
      if (inPantryIngredient) { // if pantry item already exist
        foodGroup.visibility = true;
        return;
      }
    }

    var response = this.pantryApiService.AddPantryItem(newPantryItem).subscribe({
      next: (res => {
        // Setup New Ingredient
        const defaultUnits: Units = {
          unitid: 1,
          unitname: 'cnt'
        }
        const newIngredientToAdd: IngredientsWithPantryDetails = {
          quantity: 1,
          units: defaultUnits,
          purchasedate: new Date(),
          ingredientid: validIngredient.ingredientid,
          foodgroupid: validIngredient.foodgroupid,
          ingredientname: validIngredient.ingredientname,
          ingredientdescription: validIngredient.ingredientdescription,
          notes: ''
        }
        // Check for new foodgroup
        let existingFoodGroup = this.myPantryListGroupByFoodId.find(fg => {
          return fg.foodGroupId == validIngredient.foodgroupid;
        })
        // Add to existing food group with match
        if (existingFoodGroup) {
          existingFoodGroup.visibility = true;
          existingFoodGroup.ingredients.push(newIngredientToAdd)
        } else { // Add new food category
          const newFoodGroup = this.listOfFoodGroups.find(fg => {
            return fg.foodGroupId == newIngredientToAdd.foodgroupid
          })
          if (newFoodGroup == null) return; // Shouldn't happen
          let pantryGroup: PantryItemsFG = {
            foodGroupId: newFoodGroup.foodGroupId,
            foodGroupName: newFoodGroup.foodGroupName,
            visibility: true,
            ingredients: []
          }
          pantryGroup.ingredients.push(newIngredientToAdd);
          this.sortedPush(this.myPantryListGroupByFoodId, pantryGroup);
        }
        this.myPantryList.next(this.myPantryListGroupByFoodId)
      }),
      error: (err) => {
        console.error(err);
      }
    });
  }

  UpdatePantryItem(pantryitem: UpdatePantryItemRequestDto) {
    let updatedItemIndex = -1;
    let updatedFgIndex = -1;
    for (let fg of this.myPantryListGroupByFoodId) {
      updatedFgIndex++;
      updatedItemIndex = fg.ingredients.findIndex(ing => ing.ingredientid == pantryitem.ingredientid)
      if (updatedItemIndex!=-1) break;
    }
    if (updatedItemIndex == undefined) return;
    this.pantryApiService.UpdatePantryItem(pantryitem).subscribe({
      next: (response) => {
        console.log(response)
        this.myPantryListGroupByFoodId[updatedFgIndex].ingredients[updatedItemIndex].units.unitid = pantryitem.units;
        this.myPantryListGroupByFoodId[updatedFgIndex].ingredients[updatedItemIndex].units.unitname = this.unitMap.get(pantryitem.units) || 'cnt'
        this.myPantryListGroupByFoodId[updatedFgIndex].ingredients[updatedItemIndex].notes = pantryitem.notes;
        this.myPantryListGroupByFoodId[updatedFgIndex].ingredients[updatedItemIndex].quantity = pantryitem.quantity;
        this.myPantryListGroupByFoodId[updatedFgIndex].ingredients[updatedItemIndex].purchasedate = pantryitem.purchasedate;
        this.myPantryListGroupByFoodId[updatedFgIndex].ingredients[updatedItemIndex].expirationdate = pantryitem.expirationdate;
        this.myPantryList.next(this.myPantryListGroupByFoodId);
      },
      error: (err: any) => {
        console.error(err)
      }
    })
  }

  deletePantryItem(pantryItemToDelete: number){
    let validIngredient = -1;
    this.pantryApiService.DeletePantryItem(pantryItemToDelete).subscribe({
      next: (res) => {
        for (const foodGroup of this.myPantryListGroupByFoodId) {
          validIngredient = foodGroup.ingredients.findIndex(ingredient => {
            return ingredient.ingredientid === pantryItemToDelete;
          })
          if (validIngredient != -1) {
            foodGroup.ingredients.splice(validIngredient, 1);
            this.myPantryList.next(this.myPantryListGroupByFoodId);
            break;
          }
        }
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  toggleVisibility(index: number){
    let toggledTab = this.myPantryList.value.find(tab=>tab.foodGroupId == index);
    if (toggledTab) toggledTab.visibility = !toggledTab.visibility;
  }

  // Take some time to simplfy this logic
  CompleteShoppingList(shoppingListItems: ShoppingItemRequestDto[]) {
    for (var shoppingitem of shoppingListItems) {
      // Get valid ingredient
      let validIngredient: Ingredient | undefined = undefined;
      let foodgroupname: string = '';
      for (var foodgroup of this.listOfFoodGroups) {
        validIngredient = foodgroup.ingredients.find(x => x.ingredientid === shoppingitem.ingredientid);
        foodgroupname = foodgroup.foodGroupName;
        if (validIngredient) break;
      }
      if (!validIngredient) break; // Should always be valid. Set error or message of some kind

      // Check to see if item is already in list
      let existingIngredient: IngredientsWithPantryDetails | undefined = undefined;
      let foundFoodGroup: boolean = false;
      for (var pantryitem of this.myPantryListGroupByFoodId) {
        if (pantryitem.foodGroupId == validIngredient?.foodgroupid) {
          foundFoodGroup = true;
          existingIngredient = pantryitem.ingredients.find(item => item.ingredientid === shoppingitem.ingredientid);
          if (existingIngredient) { // Item already in list
            pantryitem.visibility = true;
            break;
          } else { // Add new item
            pantryitem.visibility = true;
            let unitInfo = this.unitMap.get(shoppingitem.units);
            let unitDesc: Units;
            if (unitInfo) {
              unitDesc = {
                unitid: shoppingitem.units,
                unitname: unitInfo
              }
            } else {
              unitDesc = {
                unitid: 1,
                unitname: "cnt"
              }
            }
            let newPantryItem: IngredientsWithPantryDetails = {
              quantity: shoppingitem.quantity || 1,
              units: unitDesc,
              purchasedate: new Date(),
              ingredientid: shoppingitem.ingredientid,
              foodgroupid: pantryitem.foodGroupId,
              ingredientname: validIngredient.ingredientname,
              ingredientdescription: validIngredient.ingredientdescription,
              expirationdate: undefined,
              notes: ''
            }
            pantryitem.ingredients.push(newPantryItem);
          }
        }
      }
      // No food group found. Insert new food group
      if (!foundFoodGroup) {
        let unitInfo = this.unitMap.get(shoppingitem.units);
        let unitDesc: Units;
        if (unitInfo) {
          unitDesc = {
            unitid: shoppingitem.units,
            unitname: unitInfo
          }
        } else {
          unitDesc = {
            unitid: 1,
            unitname: "cnt"
          }
        }
        let newPantryItem: IngredientsWithPantryDetails = {
          quantity: shoppingitem.quantity || 1,
          units: unitDesc,
          purchasedate: new Date(),
          ingredientid: shoppingitem.ingredientid,
          foodgroupid: validIngredient.foodgroupid,
          ingredientname: validIngredient.ingredientname,
          ingredientdescription: validIngredient.ingredientdescription,
          expirationdate: undefined,
          notes: ''
        }
        let newFoodGroup: PantryItemsFG = {
          foodGroupId: validIngredient?.foodgroupid,
          foodGroupName: foodgroupname,
          visibility: true,
          ingredients: []
        }
        newFoodGroup.ingredients.push(newPantryItem);
        this.myPantryListGroupByFoodId.push(newFoodGroup)
      }
    }
    this.myPantryList.next(this.myPantryListGroupByFoodId);
  }


  // Private Functions 
  // Convert pantryListResponse to PantryItemFG
  private mapToNewStructure(pantryList: PantryListResponse[]): PantryItemsFG[] {
    const grouped = pantryList.reduce((acc, item) => {
        const { foodgroupid, foodgroupname, ingredientid, ingredientname, ingredientdescription, quantity, units, purchasedate, expirationdate, notes } = item;

        // Initialize the group if it doesn't exist yet
        if (!acc[foodgroupid]) {
            acc[foodgroupid] = {
                foodGroupId: foodgroupid,
                foodGroupName: foodgroupname,
                visibility: false, // Assuming visibility is always true
                ingredients: [] // Initialize empty ingredients list
            };
        }

        // Create the IngredientWithDetails object
        const ingredientWithDetails: IngredientsWithPantryDetails = {
          ingredientid,
          foodgroupid,
          ingredientname,
          ingredientdescription,
          quantity,
          units,
          purchasedate,
          expirationdate,
          notes
        };

        // Push the new ingredient into the corresponding food group
        acc[foodgroupid].ingredients.push(ingredientWithDetails);

        return acc;
    }, {} as Record<number, PantryItemsFG>); // The accumulator is a dictionary keyed by foodgroupid

    // Convert the grouped object into an array of FoodGroupsWithDetails
    return Object.values(grouped);
  }

  // Push new item into pantry in order
  private sortedPush (arr: PantryItemsFG[], element: PantryItemsFG): void {
    let left: number = 0;
    let right: number = arr.length-1;
    while (left < right) {
      const mid = Math.floor((left+right)/2)
      if (arr[mid].foodGroupId < element.foodGroupId) {
        left = mid+1;
      } else {
        right = mid;
      }
    }
    arr.splice(left, 0, element);
  }

}
