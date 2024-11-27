import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShoppingLists, ShoppingListItems } from '../../Models/shopping-lists';
import { ShoppingListRequestDto } from '../../DTO/RequestDto/shopping-list-request-dto';
import { UpdateListNameRequestDto } from '../../DTO/RequestDto/update-list-name-request-dto';
import { ShoppingItemRequestDto } from '../../DTO/RequestDto/shopping-item-request-dto';
import { UpdateCheckListRequestDto } from '../../DTO/RequestDto/update-checklist-request-dto';

@Injectable({
  providedIn: 'root'
})
export class ShoppingcartApiService {

  private shoppingApiUrl = `${environment.apiBaseUrl}/recipe-api/PantryAndShopping`

  constructor(private http: HttpClient) { }

  GetShoppingCartService(): Observable<ShoppingLists[]> {
    const url = `${this.shoppingApiUrl}/GetShoppingList`;
    const shoppinglists = this.http.get<ShoppingLists[]>(url, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'
    })
    return shoppinglists;
  } 

  AddShoppingList(newlist: ShoppingListRequestDto): Observable<any> {
    const url = `${this.shoppingApiUrl}/AddShoppingList`
    const response = this.http.post<any> (url, newlist, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'      
    })
    return response;
  }

  UpdateListName(listName: UpdateListNameRequestDto): Observable<any> {
    const url = `${this.shoppingApiUrl}/UpdateListName`
    const response = this.http.patch<any> (url, listName, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'   
    })
    return response;
  }

  DeleteShoppingList(listid: number): Observable<any> {
    const url =`${this.shoppingApiUrl}/DeleteShoppingList`
    const options = {
      params: new HttpParams().set('listid', listid.toString())
    }
    const response = this.http.delete<any>(url, options);
    return response;
  }

  AddShoppingItem(item: ShoppingItemRequestDto): Observable<any> {
    const url = `${this.shoppingApiUrl}/AddShoppingItem`
    const response = this.http.post<any> (url, item, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'   
    })
    return response;
  }

  UpdateShoppingItem(item: ShoppingItemRequestDto): Observable<any> {
    const url = `${this.shoppingApiUrl}/UpdateShoppingItem`
    const response = this.http.put<any> (url, item, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'   
    })
    return response;
  }

  UpdateCheckList(listid: number, checklist: UpdateCheckListRequestDto[]): Observable<any> {
    const url = `${this.shoppingApiUrl}/UpdateCheckList?listid=${listid}`
    const response = this.http.patch<any> (url, checklist, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'  
    })
    return response;
  }

  DeleteShoppingItem(listid: number, ingredientid: number): Observable<any> {
    const url = `${this.shoppingApiUrl}/DeleteShoppingItem`;
    const options = {
      params: new HttpParams()
      .set('listid', listid.toString())
      .set('ingredientid', ingredientid.toString())
    }
    const response = this.http.delete<any> (url, options)
    return response;
  }

  CompleteShoppingList(listid: number, items: ShoppingItemRequestDto[]){
    const url = `${this.shoppingApiUrl}/CompleteShoppingList?listid=${listid}`
    const response = this.http.post<any> (url, items, {
      headers: new HttpHeaders({"Content-Type": "application/json"}),
      responseType: 'json'  
    })
    return response;
  }
}
