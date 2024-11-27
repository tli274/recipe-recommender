import { IngredientsWithPantryDetails } from "./ingredient";

export interface PantryItemsFG {
    foodGroupId: number;
    foodGroupName: string;
    visibility: boolean;
    ingredients: IngredientsWithPantryDetails[];
}
