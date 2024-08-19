import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { FoodGroups } from '../Models/food-groups';
import { group } from '@angular/animations';
import { FoodDetails } from '../Models/food-details';
import { environment } from '../environment';
import { HttpClient } from '@angular/common/http';
import { FoodGroupDto } from '../DTO/food-group-dto';
import { Ingredient } from '../Models/ingredient';

@Injectable({
  providedIn: 'root'
})
export class PantryService {

  constructor(private http: HttpClient) {}

  private apiUrl = `${environment.apiBaseUrl}/recipe-api/FoodGroup`;

  // Simulate fetch from api, will change once database is completed


  GetFoodGroupWithPantryItem(): Observable<FoodGroups[]> {
    const url = `${this.apiUrl}/getFoodGroupsWithIngredients`;
    const test = this.http.get<FoodGroupDto[]>(url).pipe(
      map((foodGroupDtos) => 
        foodGroupDtos.map((dto) => this.mapToFoodGroup(dto))
      )
    );
    console.log(test)
    return test
  }

  private mapToFoodGroup(dto: FoodGroupDto): FoodGroups {
    const test: Ingredient[] = [];
    dto.ingredients.map((ingredient) => {
      const anotherTest: Ingredient = 
      {
        ingredientId: ingredient.ingredientid,
        ingredientName: ingredient.ingredientname,
        ingredientDescription: ingredient.ingredientdescription,
        foodGroupId: ingredient.foodgroupid
      }
      test.push(anotherTest)
    })

    const data: FoodGroups = {
      foodGroupId: dto.foodGroupId,
      foodGroupName: dto.foodGroupName,
      visibility: false,
      ingredients: test
    }
    return data
  }
}
