import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { Observable } from 'rxjs';
import { RecipeResponse } from '../../DTO/ResponseDto/recipe-response';
import { RecipeRequestDto } from '../../DTO/RequestDto/recipe-request-dto';

@Injectable({
  providedIn: 'root'
})
export class RecipeApiService {

  constructor(private http: HttpClient) { }

  private recipeApiUrl = `${environment.apiBaseUrl}/recipe-api/Recipe`;

  GetMyRecipeRequest(): Observable<RecipeResponse[]>{
    const url = `${this.recipeApiUrl}/GetMyRecipes`;
    const recipeList = this.http.get<RecipeResponse[]>(url, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'
    })
    return recipeList;
  }

  GetRecipeById(userid: string): Observable<RecipeResponse[]> {
    const url = `${this.recipeApiUrl}/GetRecipeById/${userid}`;
    const recipeList = this.http.get<RecipeResponse[]>(url, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'
    })
    return recipeList;
  }

  AddNewRecipe(recipeRequest: RecipeRequestDto): Observable<any> {
    const url = `${this.recipeApiUrl}/AddNewRecipe`;
    const response = this.http.post<any>(url, recipeRequest, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'
    })
    return response; 
  }

  EditRecipe(recipeRequest: RecipeRequestDto): Observable<any> {
    const url = `${this.recipeApiUrl}/UpdateRecipe`;
    const response = this.http.put<any>(url, recipeRequest, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'    
    })
    return response;  
  }

  DeleteRecipe(recipeid: number): Observable<any> {
    const url = `${this.recipeApiUrl}/DeleteRecipe`;
    const options = {
      params: new HttpParams().set('recipeid', recipeid.toString())
    };
    const response = this.http.delete<any>(url, options)
    return response;
  }
}
