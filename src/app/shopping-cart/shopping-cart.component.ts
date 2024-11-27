import { Component, ElementRef, inject, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs'
import { PantryApiService } from '../../Service/Pantry/pantry-api.service';
import { Ingredient, IngredientsWithPantryDetails } from '../../Models/ingredient';
import { FoodGroups } from '../../Models/food-groups';
import { PantryListResponse } from '../../Models/pantry-list-response';
import { Units } from '../../Models/units';
import { PantryItemsFG } from '../../Models/pantry-items-fg';
import { MyPantryService } from '../../Service/Pantry/my-pantry.service';
import { ShoppingListItems, ShoppingLists } from '../../Models/shopping-lists';
import { ShoppingCartService } from '../../Service/Shopping/shopping-cart.service';
import { MatDialog } from '@angular/material/dialog';
import { PantryItemComponent } from '../pantry-item/pantry-item.component';
import { ShoppingItemComponent } from '../shopping-item/shopping-item.component';
import { ShoppingItemCheckList } from '../../Models/shopping-item-checks';
import { ShoppingPantryService } from '../../Service/Shopping/shopping-pantry.service';
import { ReferenceService } from '../../Service/Reference/reference.service';
import { UpdatePantryItemRequestDto } from '../../DTO/RequestDto/update-pantry-dto';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule, 
    MatCardModule,
    MatCheckboxModule,
    MatSidenavModule, MatInputModule, 
    MatFormFieldModule, MatIconModule, 
    MatTooltipModule, MatTabsModule,
    ReactiveFormsModule
    ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {


  maxSuggestions: number = 15;
  currentPage: number = 1;
  displayedIngredients: Ingredient[] = [];

  // Pantry Search
  pantrySearchText: string = ""
  autoCompleteOpen: boolean = false;
  @ViewChild('auto') autocomplete!: MatAutocomplete;

  // My Pantry List
  myPantryList: PantryListResponse[] = [];
  myPantryListGroupByFoodId: PantryItemsFG[] = [];

  // Pantry Subscription
  myPantrySubscription: PantryItemsFG[] = [];

  // Shopping Cart Subscription
  myShoppingSubscription: ShoppingLists[] = [];
  activeShoppingTab: ShoppingLists = this.myShoppingSubscription[0];

  // Food Group Subscription
  foodGroupsSubscription: FoodGroups[] = [];

  // Shopping List Open
  @ViewChildren('auto') ListOfAutocomplete!: MatAutocomplete;

  // Scroll Behavior (ShoppingList)
  @ViewChild('shoppingListScroll') private shoppinglistcontrol!: ElementRef;
  private shoppingListScroll: boolean = false;
  private prevListLength = 2000; // ya need a smaller list if you have this much items
  
  // Dialog Box
  readonly dialog = inject(MatDialog);

  // Units
  units: Units[] = [];

  links:string[] = []
  activeLink = this.links[0];

  ingredientControl = new FormControl('');
  productControl = new FormControl('')

  // foodGroups: FoodGroups[] = [];
  ingredientsList: Ingredient[] = [];
  filteredIngredientList: Ingredient[] = [];

  foodGroups: FoodGroups[] = [];

  constructor(private pantryApiService: PantryApiService, private myPantryService: MyPantryService, private myShoppingService: ShoppingCartService, private shoppingPantryService: ShoppingPantryService, private referenceService: ReferenceService){

  }

  ngOnInit():void {
    this.SetPantry();
  }

  addLink(){
    this.myShoppingService.addShoppingLink();
    // Consider race conditions
    // this.activeShoppingTab = this.myShoppingSubscription[this.myShoppingSubscription.length-1]
  }

  // Set pantry
  // Potentially rework to reduce api call to one
  SetPantry(){
    // Get FoodGroups
    this.pantryApiService.GetFoodGroupWithPantryItem().subscribe({
      next: (foodGroups: FoodGroups[]) => {
        this.foodGroups = foodGroups;
      },
      error: (err) => {
        console.error("Error loading food groups and ingredients: ", err);
      }
    });
    // Get Ingredients List
    this.pantryApiService.GetIngredientsList().subscribe({
      next: (ingredient: Ingredient[]) => {
        this.ingredientsList = ingredient;
      },
      error: (err) => {
        console.log(err)
      }
    })
    // Handle unit initialization
    this.pantryApiService.GetUnitsList().subscribe({
      next: (units: Units[]) => {
        this.units = units;
      },
      error: (err) => {
        console.error(err);
      }
    })
    // Get Pantry Items
    this.pantryApiService.GetMyPantryItems().subscribe({
      next: (pantryList: PantryListResponse[]) => {
        this.myPantryList = pantryList;
        this.myPantryListGroupByFoodId = this.mapToNewStructure(this.myPantryList)
        console.log(this.myPantryListGroupByFoodId)
      },
      error: (err) => {
        console.error(err)
      }
    })
    this.myPantryService.myPantryList.subscribe({
      next: (pantryList: PantryItemsFG[]) => {
        this.myPantrySubscription = pantryList;
      },
      error: (err) => {
        console.error(err)
      }
    })
    // Get Shopping List
    this.myShoppingService.publicShoppingListObs.subscribe({
      next: (shoppingList: ShoppingLists[]) => {
        this.myShoppingSubscription = shoppingList;
        if (this.activeShoppingTab == undefined) {
          this.activeShoppingTab = this.myShoppingSubscription[0];
        }
        if (this.shoppingListScroll) {
          setTimeout(() => {
            this.ScrolltoBottom();
            this.shoppingListScroll = false;
          }, 0);
        }
        console.log(this.myShoppingSubscription)
      },
      error: (err) => {
        console.error(err)
      }
    })
    // Get FoodGroups Map
    this.referenceService.getFoodGroup().subscribe({
      next: (foodgroup: FoodGroups[]) => {
        this.foodGroupsSubscription = foodgroup;
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  loadIngredients() {
    const nextPage = this.currentPage * this.maxSuggestions;
    const nextBatch = this.ingredientsList.slice(nextPage, nextPage+this.maxSuggestions)
    this.displayedIngredients = [...this.displayedIngredients, ...nextBatch];
    this.currentPage++;
  }

  // When the autocomplete opens, reset the current page if needed
  onAutocompleteOpened() {
    if (this.displayedIngredients.length === 0) {
      this.loadIngredients();
    }
    this.autoCompleteOpen = true;
  }

  // Close Auto Complete
  onAutoCompleteClosed() {
    this.autoCompleteOpen = false;
  }

  onScroll(event: any) {
    const threshold = 100; // Distance from the bottom to trigger loading more
    const pos = event.target.scrollTop + event.target.offsetHeight;
    const max = event.target.scrollHeight;

    if (pos > max - threshold) {
      this.loadIngredients(); // Load more ingredients when user scrolls near the bottom
    }
  }

  // Handle search input
  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.displayedIngredients = this.ingredientsList
      .filter(ingredient => ingredient.ingredientname.toLowerCase().includes(searchTerm))
      .slice(0, this.maxSuggestions); // Show filtered results, but load only pageSize items
  }

  filterIngredients(value: string | null): Ingredient[]{
    if (value != null) {
      const filterValue = value.toLowerCase();
      return this.ingredientsList.filter(ingredient => ingredient.ingredientname.toLowerCase().includes(filterValue))
    } else {
      return [];
    }
  }

  // Mapping function
  mapToNewStructure(pantryList: PantryListResponse[]): PantryItemsFG[] {
    const grouped = pantryList.reduce((acc, item) => {
        const { foodgroupid, foodgroupname, ingredientid, ingredientname, ingredientdescription, quantity, units, purchasedate } = item;

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
          notes: ''
        };

        // Push the new ingredient into the corresponding food group
        acc[foodgroupid].ingredients.push(ingredientWithDetails);

        return acc;
    }, {} as Record<number, PantryItemsFG>); // The accumulator is a dictionary keyed by foodgroupid

    // Convert the grouped object into an array of FoodGroupsWithDetails
    return Object.values(grouped);
  }

  
  toggleContent(index: number) {
    this.myPantryService.toggleVisibility(index);
  }

  addNewIngredient(){
    // Ingredient Control is null
    if (this.ingredientControl.value == null) return;
    // Convert ingredient name to ingredient id
    let foundIngredient: Ingredient | undefined = undefined;
    for (let fg of this.foodGroupsSubscription) {
      foundIngredient = fg.ingredients.find(fg => fg.ingredientname == this.ingredientControl.value);
      if (foundIngredient != undefined) break;
    }
    if (foundIngredient == undefined) return; // Set error for unfound element

    let newPantryItem: UpdatePantryItemRequestDto = {
      ingredientid: foundIngredient.ingredientid,
      quantity: 1,
      purchasedate: new Date(),
      expirationdate: undefined,
      units: 1,
      notes:''
    }

    this.myPantryService.addItemToPantry(newPantryItem);
    this.ingredientControl.setValue("")
  }

  addNewIngredientOnEnter(event: KeyboardEvent) {
    if (event.key === "Enter" && !this.autoCompleteOpen) {
      this.addNewIngredient();
    }
  }

  deleteIngredient(ingredientid: number){
    this.myPantryService.deletePantryItem(ingredientid)
  }

  test(){
    console.log(this.activeShoppingTab)
    console.log(this.myPantryListGroupByFoodId)
  }

  UpdateUnitType(unitid:number, pantryItem: IngredientsWithPantryDetails) {
    let selectedUnit = this.units.find(unit => {
      return unit.unitid == unitid;
    })
    if (selectedUnit != null) {
      pantryItem.units = selectedUnit;
    }
    console.log(this.myPantryListGroupByFoodId)
  }

  DeleteShoppingLinks(shoppingList: ShoppingLists, event: Event) {
    event.stopPropagation();
    this.myShoppingService.deleteShoppingLink(shoppingList.listid)
    this.activeShoppingTab = this.myShoppingSubscription[0];
  }

  EditShoppingLink(shoppingList: ShoppingLists){
    shoppingList.isediting = true;
  }

  stopEditing(shoppingList: ShoppingLists) {
    this.myShoppingService.updateListName(shoppingList)
    shoppingList.isediting = false;
  }

  AddShoppingItem() {
    if (this.productControl.value == null) return;
    this.myShoppingService.AddShoppingItem(this.productControl.value, this.activeShoppingTab.listid)
    this.shoppingListScroll = true;
    this.productControl.setValue("");
  }

  AddShoppingItemOnEnter(event: KeyboardEvent){
    if (event.key === "Enter" && !this.autoCompleteOpen) {
      this.AddShoppingItem();
    }
  }

  DeleteShoppingItem(shoppingItem: ShoppingListItems, event: Event){
    event.stopPropagation();
    this.myShoppingService.DeleteShoppingItem(this.activeShoppingTab.listid, shoppingItem.ingredientid)
  }

  OpenShoppingItem(shoppingItem: ShoppingListItems){
    const dialogRef = this.dialog.open(ShoppingItemComponent, {
      // disableClose:true,
      data: {
        listid: this.activeShoppingTab.listid,
        shoppingItem: shoppingItem
      },
      width: '80%',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)
    })
  }

  OpenPantryItem(pantryItem: IngredientsWithPantryDetails) {
    const dialogRef = this.dialog.open(PantryItemComponent, {
      // disableClose:true,
      data: {
        pantryitem: pantryItem
      },
      width: '80%',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)
    })  
  }

  ScrolltoBottom(){
    try {
      this.shoppinglistcontrol.nativeElement.scrollTop = this.shoppinglistcontrol.nativeElement.scrollHeight;
    }
    catch(err) {
      console.log('Error auto scroll: ', err);
    }
  }

  LogToggle(shoppingItem: ShoppingListItems) {
    let checkList: ShoppingItemCheckList = {
      ingredientid: shoppingItem.ingredientid,
      incart: shoppingItem.incart,
      changedate: new Date()
    }
    this.myShoppingService.LogChangesToCheckList(this.activeShoppingTab.listid, checkList);
  }

  UpdateCheckList() {
    this.myShoppingService.UpdateCheckList(this.activeShoppingTab.listid);
  }

  OpenNotes() {

  }

  CompleteShoppingList() {
    this.shoppingPantryService.CompleteCheckList(this.activeShoppingTab);
    this.activeShoppingTab = this.myShoppingSubscription[0];
  }
 }
