import { Component, inject } from '@angular/core';
import { PantryItemsFG } from '../../Models/pantry-items-fg';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ReferenceService } from '../../Service/Reference/reference.service';
import { ShoppingCartService } from '../../Service/Shopping/shopping-cart.service';
import { ShoppingItemComponent } from '../shopping-item/shopping-item.component';
import { Priority } from '../../Models/priority';
import { Units } from '../../Models/units';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MyPantryService } from '../../Service/Pantry/my-pantry.service';
import { IngredientsWithPantryDetails } from '../../Models/ingredient';
import { PantryItemDialog } from '../../Models/pantry-item-dialog';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { UpdatePantryItemRequestDto } from '../../DTO/RequestDto/update-pantry-dto';


@Component({
  selector: 'app-pantry-item',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule, 
    MatInputModule, MatDialogTitle, 
    MatDialogContent,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './pantry-item.component.html',
  styleUrl: './pantry-item.component.scss'
})
export class PantryItemComponent {
  pantryitem: PantryItemDialog = inject(MAT_DIALOG_DATA)
  unitsList: Units[] = [];
  priorityList: Priority[] = [];

  pantryItemForm: FormGroup = new FormGroup({
    notes: new FormControl<string>(this.pantryitem.pantryitem.notes, [Validators.maxLength(200)]),
    quantity: new FormControl<number>(this.pantryitem.pantryitem.quantity,[Validators.required, Validators.min(0)]),
    units: new FormControl<number>(this.pantryitem.pantryitem.units.unitid, [Validators.required]),
    purchasedate: new FormControl<Date | null>(this.pantryitem.pantryitem.purchasedate || null, [Validators.required]),
    expirationdate: new FormControl<Date | null>(this.pantryitem.pantryitem.expirationdate || null)
  })

  constructor(private referenceService: ReferenceService, 
    private myPantryService: MyPantryService,
    private dialogRef: MatDialogRef<ShoppingItemComponent>,
  ) { }

  ngOnInit(){
    // Set up references 
    this.referenceService.getUnits().subscribe({
      next: (units: Units[]) => {
        this.unitsList = units;
      },
      error: (err) => {
        console.error(err)
      }
    })
    this.referenceService.getPriority().subscribe({
      next: (prio: Priority[]) => {
        this.priorityList = prio;
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  formatQuantity(element:any) {
    let formattedQuantity: string = Number(element.target.value).toFixed(0);
    element.target.value = formattedQuantity;
  }

  updateItem() {
    if (!this.pantryItemForm.valid) return; // Show error of some kind
    let updatedPantryItem: UpdatePantryItemRequestDto = {
      ingredientid: this.pantryitem.pantryitem.ingredientid,
      quantity: this.pantryItemForm.value.quantity,
      purchasedate: this.pantryItemForm.value.purchasedate,
      expirationdate: this.pantryItemForm.value.expirationdate,
      units: this.pantryItemForm.value.units,
      notes: this.pantryItemForm.value.notes
    }
    this.myPantryService.UpdatePantryItem(updatedPantryItem);
    this.closeDialog();
  }

  test() {
    console.log(this.pantryitem)
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
