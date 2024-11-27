import { Injectable, numberAttribute } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { FoodGroups } from '../../Models/food-groups';
import { group } from '@angular/animations';
import { FoodDetails } from '../../Models/food-details';
import { environment } from '../../environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FoodGroupDto } from '../../DTO/food-group-dto';
import { Ingredient } from '../../Models/ingredient';
import { PantryListResponse } from '../../Models/pantry-list-response';
import { Units } from '../../Models/units';
import { UpdatePantryItemRequestDto } from '../../DTO/RequestDto/update-pantry-dto';
import { PantryIdRequestDto } from '../../DTO/RequestDto/pantry-id-request-dto';

@Injectable({
  providedIn: 'root'
})
export class PantryApiService {

  constructor(private http: HttpClient) {}

  private apiUrl = `${environment.apiBaseUrl}/recipe-api/FoodGroup`;
  private pantryApiUrl = `${environment.apiBaseUrl}/recipe-api/PantryAndShopping`

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
    const ingredientsList: Ingredient[] = [];
    dto.ingredients.map((ingredient) => {
      const ingredientModel: Ingredient = 
      {
        ingredientid: ingredient.ingredientid,
        ingredientname: ingredient.ingredientname,
        ingredientdescription: ingredient.ingredientdescription,
        foodgroupid: ingredient.foodgroupid
      }
      ingredientsList.push(ingredientModel)
    })

    const data: FoodGroups = {
      foodGroupId: dto.foodGroupId,
      foodGroupName: dto.foodGroupName,
      visibility: false,
      ingredients: ingredientsList
    }
    return data
  }

  GetIngredientsList(): Observable<Ingredient[]> {
    const url = `${this.apiUrl}/getIngredients`;
    const ingredientList = this.http.get<Ingredient[]>(url, { 
            headers: new HttpHeaders({"Content-Type": "application/json"}),
            responseType: 'json'
      }
    )
    return ingredientList;
  }

  GetMyPantryItems(): Observable<PantryListResponse[]> {
    const url = `${this.pantryApiUrl}/GetPantryList`;
    const pantryList = this.http.get<PantryListResponse[]>(url, {
        headers: new HttpHeaders({"Content-Type": "application/json"}),
        responseType: 'json'
      }
    )
    return pantryList;
  }

  AddPantryItem(pantryItem: UpdatePantryItemRequestDto): Observable<any> {
    const url = `${this.pantryApiUrl}/AddPantryItem`;
    const response = this.http.post<any>(url, pantryItem, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'     
    })
    return response;
  }

  UpdatePantryItem(pantryItem: UpdatePantryItemRequestDto): Observable<any> {
    const url = `${this.pantryApiUrl}/UpdatePantryItem`;
    const response = this.http.put<any>(url, pantryItem, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'        
    })
    return response;
  }

  DeletePantryItem(ingredientid: number): Observable<any> {
    const url = `${this.pantryApiUrl}/DeletePantryItem`
    const options = {
      params: new HttpParams().set('ingredientid', ingredientid.toString())
    };
    const response = this.http.delete<any>(url, options);
    return response;
  }

  GetUnitsList(): Observable<Units[]> {
    const url = `${this.pantryApiUrl}/GetAllUnits`
    const units = this.http.get<Units[]>(url, {
        headers: new HttpHeaders({"Content-Type": "application/json"}),
        responseType: 'json'
    })
    return units;
  }
}
