import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Units } from '../../Models/units';
import { environment } from '../../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Priority } from '../../Models/priority';
import { FoodGroupDto } from '../../DTO/food-group-dto';
import { FoodGroups } from '../../Models/food-groups';
import { Ingredient } from '../../Models/ingredient';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {

  // API urls
  private pantryApiUrl = `${environment.apiBaseUrl}/recipe-api/PantryAndShopping`
  private referenceApiUrl = `${environment.apiBaseUrl}/recipe-api/Reference`
  private foodGroupApiUrl = `${environment.apiBaseUrl}/recipe-api/FoodGroup`;


  // Reference Info
  private unitsInfo: Units[] = [];
  private unitsMap: Map<number, string> = new Map<number, string>();
  private priorityInfo: Priority[] = []
  private priorityMap: Map<number, string> = new Map<number, string>();
  private ingredientsInfo: Ingredient[] = [];
  private foodGroupInfo: FoodGroups[] = [];
  // private foodGroupMapName: Map<string, FoodGroups>[] = [];

  // Observables


  constructor(private http: HttpClient) { }

  // Initialization calls
  public initializeAllReferences(){
    this.initializeUnits();
    this.initializePriority();
    this.initializeIngredients();
    this.initializeFoodGroup();
  }

  // Initialize Units
  public initializeUnits(){
    this.GetUnitsList().subscribe({
      next: (units: Units[]) => {
        this.unitsInfo = units;
        for (var unit of units) {
          this.unitsMap.set(unit.unitid, unit.unitname);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // Initialize Priority
  public initializePriority(){
    this.GetPriorityList().subscribe({
      next: (priority: Priority[]) => {
        this.priorityInfo = priority;
        for (var prio of priority) {
          this.priorityMap.set(prio.priorityid, prio.prioritydesc)
        }
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  // Initialize Ingredients 
  public initializeIngredients() {
    this.GetIngredients().subscribe({
      next: (ingredients: Ingredient[]) => {
        this.ingredientsInfo = ingredients;
      }
    })
  }

  // Initialize Food Group
  public initializeFoodGroup(){
    this.GetFoodGroupWithPantryItem().subscribe({
      next: (foodgroup: FoodGroups[]) => {
        this.foodGroupInfo = foodgroup;
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  // Getters
  public getUnits(): Observable<Units[]> {
    // if unitsInfo is empty, make an attempt to connect to the api 
    if (this.unitsInfo.length == 0) {
      return this.GetUnitsList().pipe(
        tap(units => this.unitsInfo = units),
        catchError(err => {
          console.error('Error fetching units', err);
          return of([]);
        })
      );
    }
    return of(this.unitsInfo);
  }

  public getUnitsMap(): Observable<Map<number, string>> {
    if (this.unitsMap.size == 0) {
      this.initializeUnits(); // Make an attempt to connect to units
    }
    return of(this.unitsMap);
  }

  public getPriority(): Observable<Priority[]> {
    if (this.priorityInfo.length == 0) {
      return this.GetPriorityList().pipe(
        tap(prio => this.priorityInfo = prio),
        catchError(err => {
          console.error('Error fetching priority', err);
          return of([]);
        })
      );
    }
    return of(this.priorityInfo);
  }

  public getIngredients(): Observable<Ingredient[]> {
    if (this.ingredientsInfo.length == 0) {
      this.GetIngredients().pipe(
        tap(ing => this.ingredientsInfo = ing),
        catchError(err => {
          console.error('Error fetching priority', err);
          return of([]);
        })
      );
    }
    return of(this.ingredientsInfo);
  }

  public getFoodGroup(): Observable<FoodGroups[]> {
    if (this.foodGroupInfo.length == 0) {
      return this.GetFoodGroupWithPantryItem().pipe(
        tap(fg => this.foodGroupInfo = fg),
        catchError(err => {
          console.error('Error fetching food groups', err);
          return of([])
        })
      )
    }
    return of(this.foodGroupInfo);
  }

  // API Calls
  private GetUnitsList(): Observable<Units[]> {
    const url = `${this.pantryApiUrl}/GetAllUnits`
    const units = this.http.get<Units[]>(url, {
        headers: new HttpHeaders({"Content-Type": "application/json"}),
        responseType: 'json'
    })
    return units;
  }

  private GetPriorityList(): Observable<Priority[]> {
    const url = `${this.referenceApiUrl}/GetPriority`
    const priority = this.http.get<Priority[]>(url, {
        headers: new HttpHeaders({"Content-Type": "application/json"}),
        responseType: 'json'
    })
    return priority;
  }

  private GetIngredients(): Observable<Ingredient[]> {
    const url = `${this.foodGroupApiUrl}/getIngredients`
    const ingredients = this.http.get<Ingredient[]>(url, {
        headers: new HttpHeaders({"Content-Type": "application/json"}),
        responseType: 'json'
    })
    return ingredients;
  }

  GetFoodGroupWithPantryItem(): Observable<FoodGroups[]> {
    const url = `${this.foodGroupApiUrl}/getFoodGroupsWithIngredients`;
    const test = this.http.get<FoodGroupDto[]>(url).pipe(
      map((foodGroupDtos) => 
        foodGroupDtos.map((dto) => this.mapToFoodGroup(dto))
      )
    );
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
}
