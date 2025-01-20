import { RecipeResponse } from "../DTO/ResponseDto/recipe-response";

export interface RecipeViewDetails {
    recipe: RecipeResponse,
    activeUser: boolean,
}