import { Injectable } from '@angular/core';
import { RecipeApiService } from './recipe-api.service';
import { RecipeResponse } from '../../DTO/ResponseDto/recipe-response';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
import { RecipeRequestDto } from '../../DTO/RequestDto/recipe-request-dto';

@Injectable({
  providedIn: 'root'
})
export class ManageRecipeService {
  // Posted Recipes
  private MyPostedRecipes: RecipeResponse[] = [];
  private MyPostedRecipesBS: BehaviorSubject<RecipeResponse[]> = new BehaviorSubject<RecipeResponse[]>([]);
  public MyPostedRecipesObs: Observable<RecipeResponse[]> = this.MyPostedRecipesBS.asObservable();

  constructor(private recipieApi: RecipeApiService) { }
  
  // Initialize Recipe Services 
  public InitializeRecipeServices() {
    this.InitializePostedRecipes();
  }

  // Intialize Posted Recipes
  private InitializePostedRecipes() {
    this.recipieApi.GetMyRecipeRequest().subscribe({
      next: (recipeResponse: RecipeResponse[]) => {
        this.MyPostedRecipes = recipeResponse;
        this.MyPostedRecipesBS.next(this.MyPostedRecipes);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  // Add New Recipes
  public AddNewRecipe(recipeRequest: RecipeRequestDto, recipeResponse: RecipeResponse) {
    this.recipieApi.AddNewRecipe(recipeRequest).subscribe({
      next: () => {
        this.MyPostedRecipes.push(recipeResponse);
        this.MyPostedRecipesBS.next(this.MyPostedRecipes);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  // Update Recipe
  public UpdateRecipe(recipeRequest: RecipeRequestDto, recipeResponse: RecipeResponse) {
    this.recipieApi.EditRecipe(recipeRequest).subscribe({
      next: () => {
        var index = this.MyPostedRecipes.findIndex(recipe => recipe.recipeid == recipeResponse.recipeid);
        this.MyPostedRecipes[index] = recipeResponse;
        this.MyPostedRecipesBS.next(this.MyPostedRecipes);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  // Delete Recipe
  public DeleteRecipe(recipeid: number) {
    let index = this.MyPostedRecipes.findIndex(recipe => recipe.recipeid == recipeid)
    if (index == -1) {
      return; // Set error of no such ingredient or what not
    }
    this.recipieApi.DeleteRecipe(recipeid).subscribe({
      next: () => {
        this.MyPostedRecipes.splice(index, 1);
        this.MyPostedRecipesBS.next(this.MyPostedRecipes);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

}
