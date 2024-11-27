import { Priority } from "./priority";
import { Units } from "./units";

export interface ShoppingLists {
    listid: number,
    iscompleted: boolean,
    createddate: Date,
    completiondate?: Date,
    listname: string,
    notes: string,
    isediting?: boolean,
    total: number,
    shoppingListItems?: ShoppingListItems[]
}

export interface ShoppingListItems {
    ingredientid: number,
    ingredientname: string,
    price?: number,
    quantity?: number,
    units: Units,
    priority: Priority,
    incart: boolean,
    notes: string
}