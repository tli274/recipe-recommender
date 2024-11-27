import { Units } from "../../Models/units";
import { IngredientDto } from "../ingredients-dto";

export interface RecipeResponse {
    recipeid: number,
    recipename: string,
    author: string,
    recipedescription: string,
    recipedirections: string,
    rating: number,
    calorieperserving: number,
    servingsize: number,
    username: string,
    cooktime: number,
    ingredients: RecipeIngredientResponse[]
}

export interface RecipeIngredientResponse {
    ingredientid: number,
    ingredientname: string,
    quantity: number,
    units: Units 
}