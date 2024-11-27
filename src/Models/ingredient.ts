    import { Units } from "./units";

export interface Ingredient {
    ingredientid: number;
    foodgroupid: number;
    ingredientname: string;
    ingredientdescription: string;
}

export interface IngredientsWithPantryDetails extends Ingredient{
    quantity: number;
    units: Units;
    purchasedate: Date;
    expirationdate?: Date;
    notes: string;
}