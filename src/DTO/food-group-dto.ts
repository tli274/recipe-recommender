import { IngredientDto } from "./ingredients-dto";

export interface FoodGroupDto {
    foodGroupId: number;
    foodGroupName: string;
    ingredients: IngredientDto[]
}