import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { Units } from '../../Models/units';
import { ReferenceService } from '../../Service/Reference/reference.service';
import { Priority } from '../../Models/priority';
import { ShoppingCartService } from '../../Service/Shopping/shopping-cart.service';
import { ShoppingItemRequestDto } from '../../DTO/RequestDto/shopping-item-request-dto';
import { ShoppingListItems } from '../../Models/shopping-lists';
import { ShoppingItemDialog } from '../../Models/shopping-item-dialog';

@Component({
  selector: 'app-shopping-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule, 
    MatInputModule, MatDialogTitle, 
    MatDialogContent,
    ReactiveFormsModule
  ],
  templateUrl: './shopping-item.component.html',
  styleUrl: './shopping-item.component.scss'
})
export class ShoppingItemComponent {
  shoppingitem: ShoppingItemDialog = inject(MAT_DIALOG_DATA)
  unitsList: Units[] = [];
  priorityList: Priority[] = [];

  shoppingItemForm: FormGroup = new FormGroup({
    notes: new FormControl<string>(this.shoppingitem.shoppingItem.notes, [Validators.maxLength(200)]),
    price: new FormControl<number>(this.shoppingitem.shoppingItem.price ?? 0, [Validators.required, Validators.min(0)]),
    quantity: new FormControl<number>(this.shoppingitem.shoppingItem.quantity ?? 1, [Validators.required, Validators.min(0)]),
    units: new FormControl<number>(this.shoppingitem.shoppingItem.units.unitid, [Validators.required]),
    priority: new FormControl<number>(this.shoppingitem.shoppingItem.priority.priorityid,[Validators.required])
  })

  constructor(private referenceService: ReferenceService, 
    private myShoppingService: ShoppingCartService,
    private dialogRef: MatDialogRef<ShoppingItemComponent>,
  ) {
    
  }

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

  formatPrices(element: any) {
    let formattedValue: string = Number(element.target.value).toFixed(2);
    element.target.value = formattedValue;
  }

  formatQuantity(element:any) {
    let formattedQuantity: string = Number(element.target.value).toFixed(0);
    element.target.value = formattedQuantity;
  }

  UpdateItem() {
    if (this.shoppingItemForm.invalid) return;
    let shoppingItemDto: ShoppingItemRequestDto = 
    {
      listid: this.shoppingitem.listid,
      ingredientid: this.shoppingitem.shoppingItem.ingredientid,
      quantity: this.shoppingItemForm.value.quantity,
      priority: this.shoppingItemForm.value.priority,
      units: this.shoppingItemForm.value.units,
      prices: this.shoppingItemForm.value.price,
      incart: this.shoppingitem.shoppingItem.incart,
      notes: this.shoppingItemForm.value.notes
    };
    this.myShoppingService.UpdateShoppingItem(shoppingItemDto)
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  test() {
    console.log(this.shoppingitem)
  }
}
