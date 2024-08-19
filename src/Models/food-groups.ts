import { Ingredient } from "./ingredient";

export interface FoodGroups {
    foodGroupId: number;
    foodGroupName: string;
    visibility: boolean;
    ingredients: Ingredient[];
} 