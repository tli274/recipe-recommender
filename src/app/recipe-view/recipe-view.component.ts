import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RecipeResponse } from '../../DTO/ResponseDto/recipe-response';
import { MatIconModule } from '@angular/material/icon';
import { EditRecipeComponent } from '../edit-recipe/edit-recipe.component';
import { RouterModule } from '@angular/router';
import { RecipeViewDetails } from '../../Models/recipe-view-details';

@Component({
  selector: 'app-recipe-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule, 
    MatInputModule, MatDialogTitle, 
    MatIconModule,
    MatDialogContent,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './recipe-view.component.html',
  styleUrl: './recipe-view.component.scss'
})
export class RecipeViewComponent {
  
  recipeInfo: RecipeViewDetails = inject(MAT_DIALOG_DATA); 

  readonly dialog = inject(MatDialog)

  constructor(
    private dialogRef: MatDialogRef<RecipeViewComponent>
  ){
  }

  OpenEditRecipeDialog(){
    const dialogRef = this.dialog.open(EditRecipeComponent, {
      disableClose:true,
      data: this.recipeInfo.recipe,
      width: '80vw',
      maxWidth: '100vw',
      height: '80vh'
    })
    this.closeDialog();
  }

  closeDialog(){
    this.dialogRef.close();
  }

  test(){
    console.log(this.recipeInfo)
  }
}
