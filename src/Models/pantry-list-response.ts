import { Units } from "./units"

export interface PantryListResponse {
    userid: string,
    username: string,
    ingredientid: number,
    ingredientname: string,
    ingredientdescription:string,
    foodgroupid: number,
    foodgroupname: string,
    quantity: number,
    notes: string,
    purchasedate: Date,
    expirationdate: Date,
    units: Units
}