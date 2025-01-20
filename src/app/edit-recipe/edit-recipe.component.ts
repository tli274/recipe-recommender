import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RecipeIngredientResponse, RecipeResponse } from '../../DTO/ResponseDto/recipe-response';
import { ReferenceService } from '../../Service/Reference/reference.service';
import { FoodGroups } from '../../Models/food-groups';
import { Ingredient } from '../../Models/ingredient';
import { Units } from '../../Models/units';
import { RecipeApiService } from '../../Service/Recipe/recipe-api.service';
import { RecipeIngredientRequestDto, RecipeRequestDto } from '../../DTO/RequestDto/recipe-request-dto';
import { AuthenticationService } from '../../Service/Authentication/authentication.service';
import { ManageRecipeService } from '../../Service/Recipe/manage-recipe.service';
import { ConfirmationMessage } from '../../Models/confirmation-message';
import { ConfirmationMessageComponent } from '../confirmation-message/confirmation-message.component';
import { MatSnackBar } from '@angular/material/snack-bar'
import { AlertMessageComponent } from '../alert-message/alert-message.component';
import { AlertMessage, AlertType } from '../../Models/alert-message';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule, 
    MatInputModule, MatDialogTitle, 
    MatIconModule,
    MatDialogContent,
    ReactiveFormsModule],
  templateUrl: './edit-recipe.component.html',
  styleUrl: './edit-recipe.component.scss'
})
export class EditRecipeComponent {
  recipeInfo: RecipeResponse | undefined = inject(MAT_DIALOG_DATA); 

  recipeForm: FormGroup = new FormGroup({
    recipename: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
    author: new FormControl<string>('', [Validators.required, Validators.maxLength(50)]),
    recipedirections: new FormControl<string>('', [Validators.required, Validators.maxLength(4000)]),
    recipedescriptions: new FormControl<string>('', [Validators.maxLength(4000)]),
    calorieperserving: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    servingsize: new FormControl<number>(1, [Validators.required, Validators.min(0)]),
    cooktime: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    ingredients: new FormArray([])
  })
  ingredients: RecipeIngredientResponse[] = [];

  // AutoComplete Feature
  @ViewChildren('autocompleteItem') ingredientElements!: QueryList<ElementRef>
  listOfIngredients: Ingredient[] = [];
  filteredIngredients: Ingredient[] = [];
  searchIngredients: string = '';
  isOpen: boolean = false;
  highlightedIndex: number = -1;

  // Units
  listOfUnits: Units[] = [];

  // Snackbar
  private alertMessage = inject(MatSnackBar)
  private durationInSeconds: number = 5;

  constructor(private dialogRef: MatDialogRef<EditRecipeComponent>, 
    private referenceService: ReferenceService, 
    private recipeManagementService: ManageRecipeService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    
  }

  ngOnInit(){
    if (this.recipeInfo != undefined) {
      for(let ing of this.recipeInfo.ingredients) {
        this.addIngredients(ing);
      }
      this.recipeForm.patchValue({
        author: this.recipeInfo.author,
        recipename: this.recipeInfo.recipename,
        recipedirections: this.recipeInfo.recipedirections,
        recipedescriptions: this.recipeInfo.recipedescription,
        calorieperserving: this.recipeInfo.calorieperserving,
        servingsize: this.recipeInfo.servingsize,
        cooktime: this.recipeInfo.cooktime,
      })

    }
    // Get List of Food Groups
    this.referenceService.getIngredients().subscribe({
      next: (ingredients: Ingredient[]) => {
        this.listOfIngredients = ingredients;
      },
      error: (err) => {
        console.error(err);
      }
    })
    // Get List of Units
    this.referenceService.getUnits().subscribe({
      next: (units: Units[]) => {
        this.listOfUnits = units;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  get ingredientsArray() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredients(ingredient: RecipeIngredientResponse) {
    const row = new FormGroup({
      ingredientid: new FormControl<number>(ingredient.ingredientid, [Validators.required]),
      ingredientname: new FormControl<string>(ingredient.ingredientname, [Validators.required]),
      quantity: new FormControl<number>(ingredient.quantity, [Validators.required]),
      units: new FormControl<number>(ingredient.units.unitid, [Validators.required]),
    })
    this.ingredientsArray.push(row);
  }

  deleteIngredient(index: number) {
    this.ingredientsArray.removeAt(index)
  }

  autoComplete() {
    this.filteredIngredients = this.listOfIngredients.filter(ing => {
      return ing.ingredientname.toLowerCase().includes(this.searchIngredients.toLowerCase())
    });
    this.highlightedIndex = -1;
    this.isOpen = this.filteredIngredients.length > 0;
  }

  selectItem(ing: Ingredient) {
    let checkIng = this.ingredients.find(ingredient => ingredient.ingredientid == ing.ingredientid);
    if (checkIng == undefined) {
      let defaultUnits: Units = {
        unitid: 1,
        unitname: 'cnt'
      }
      let newIngredient: RecipeIngredientResponse = {
        ingredientid: ing.ingredientid,
        ingredientname: ing.ingredientname,
        quantity: 1,
        units: defaultUnits
      }
      this.ingredients.push(newIngredient);
      this.addIngredients(newIngredient);
    } else {
      // briefly flash pre-existing items
    }
    this.searchIngredients = '';
    this.isOpen = false;
  }

  autoCompleteKeyEvent(event: KeyboardEvent) {
    if (this.isOpen) {
      if (event.key === 'ArrowDown') {
        if (this.highlightedIndex < this.filteredIngredients.length-1) {
          this.highlightedIndex = (this.highlightedIndex+1);
        }
        this.scrollToHighlightItem();
        event.preventDefault();
      }
      else if (event.key === 'ArrowUp') {
        if (this.highlightedIndex > 0) {
          this.highlightedIndex = (this.highlightedIndex-1);
        }
        this.scrollToHighlightItem();
        event.preventDefault();
      }
      else if (event.key === 'Enter') {
        this.selectItem(this.filteredIngredients[this.highlightedIndex])
        event.preventDefault();
      }
    }
  }

  scrollToHighlightItem() {
    const item = this.ingredientElements.toArray()[this.highlightedIndex];
    if (item) {
      item.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest'})
    }
  }

  addRecipe(){
    if (this.recipeForm.invalid){
      // Print some kind of error message for invalid fields
      let foundError: boolean = false;
      for (const key of Object.keys(this.recipeForm.controls)) {
        const control = this.recipeForm.get(key)
        if (control?.invalid) {
          let message: string = '';
          if (control.errors) { // Should always have a value if control is invalid but we do need a check.
            const errorKey = Object.keys(control.errors)[0];
            const errorValue = control.errors[errorKey];
            console.log(errorValue);
            switch (errorKey) {
              case 'required':
                message = 'This field is required.';
                break;
              case 'min': 
                message = `Minimum value is ${errorValue.min}. Your value was ${errorValue.actual}.`
                break;
              case 'maxlength':
                message = `Maximum length is ${errorValue.requiredLength}. Your value was ${errorValue.actualLength}.`
            }
          }
          let alert: AlertMessage = {
            title: 'Form Validation Error',
            message: `Formfield '${key}' is invalid. ${message}`,
            type: AlertType.error
          }
          foundError = true;
          this.openAlertMessage(alert)
          break;
        }
      }
      // I missed something so generic error
      if (!foundError) {
        let alert: AlertMessage = {
          title: 'Form Validation Error',
          message: 'Invalid form-field.',
          type: AlertType.error
        }
        this.openAlertMessage(alert)
      }
      return; 
    }

    // In edit or add mode 
    let recipeid = 0;
    if (this.recipeInfo != undefined) {
      recipeid = this.recipeInfo.recipeid;
    }
    let ingredientsRequest: RecipeIngredientRequestDto[] = [];
    let ingredientResponse: RecipeIngredientResponse[] = [];
    for (var ingForm of this.recipeForm.value.ingredients) {
      const ingRequest: RecipeIngredientRequestDto = {
        ingredientid: ingForm.ingredientid,
        quantity: ingForm.quantity,
        unitid: Number(ingForm.units),
        todelete: false
      }
      let units = this.listOfUnits.find(unit => unit.unitid == Number(ingForm.units));
      let defaultUnits: Units = {
        unitid: 1,
        unitname: 'cnt'
      }
      const ingResponse: RecipeIngredientResponse = {
        ingredientid: ingForm.ingredientid,
        ingredientname: ingForm.ingredientname,
        quantity: ingForm.quantity,
        units: units || defaultUnits
      }
      ingredientsRequest.push(ingRequest);
      ingredientResponse.push(ingResponse);
    }
    let newRecipeRequestDto: RecipeRequestDto = {
      recipeid: recipeid,
      recipename: this.recipeForm.value.recipename,
      author: this.recipeForm.value.author,
      recipedescription: this.recipeForm.value.recipedescriptions,
      recipedirections: this.recipeForm.value.recipedirections,
      rating: 0, // Not implemented yet 
      calorieperserving: this.recipeForm.value.calorieperserving,
      servingsize: this.recipeForm.value.servingsize,
      cooktime: this.recipeForm.value.cooktime,
      ingredients: ingredientsRequest
    }
    let newRecipeResponse: RecipeResponse = {
      recipeid: recipeid,
      recipename: this.recipeForm.value.recipename,
      author: this.recipeForm.value.author,
      recipedescription: this.recipeForm.value.recipedescriptions,
      recipedirections: this.recipeForm.value.recipedirections,
      rating: 0, // Not implemented yet 
      calorieperserving: this.recipeForm.value.calorieperserving,
      servingsize: this.recipeForm.value.servingsize,
      cooktime: this.recipeForm.value.cooktime,
      ingredients: ingredientResponse,
      username: 'Not important' // Look into changes 
    }
    // Make API call
    if (this.recipeInfo == undefined) {
      this.recipeManagementService.AddNewRecipe(newRecipeRequestDto, newRecipeResponse);
    } else {
      this.recipeManagementService.UpdateRecipe(newRecipeRequestDto, newRecipeResponse);
    }
    this.dialogRef.close();
  }

  deleteRecipe(){
    if (this.recipeInfo == undefined || this.recipeInfo.recipeid == undefined) {
      return; // You dont have the
    }
    const confirmationDialog = this.dialog.open(ConfirmationMessageComponent, {
      data: { title:"Delete Recipe", message:"Are you sure you want to delete this recipe? This will be permanent and you can not restore it."},
      width: '30vw'
    })
    confirmationDialog.afterClosed().subscribe(result => {
      if (result) {
        if (this.recipeInfo) { // this should always be the case but needed to get rid of error
          let alert: AlertMessage = {
            title: 'Success',
            message: 'Successfully deleted the recipe',
            type: AlertType.success
          }
          this.recipeManagementService.DeleteRecipe(this.recipeInfo.recipeid);
          this.openAlertMessage(alert)
          this.closeDialog();
        }
      } 
    })
  }

  openAlertMessage(data: AlertMessage) {
    let panelClass = '';
    if (data.type == AlertType.error)  {
      panelClass = 'error-alert';
    }
    else { // data.type == AlertType.success
      panelClass = 'success-alert'
    }
    this.alertMessage.openFromComponent(AlertMessageComponent, {
      data: {
        title: `${data.title}`,
        message: `${data.message}`,
        type: `${data.type}`
      },
      duration: this.durationInSeconds * 1000,
      verticalPosition: 'top',
      panelClass: panelClass
    })
  }

  test(){
    console.log(this.recipeForm)
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
