export interface RecipeRequestDto {
    recipeid: number,
    recipename: string,
    author: string,
    recipedescription: string,
    recipedirections: string,
    rating: number,
    calorieperserving: number,
    servingsize: number,
    cooktime: number,
    ingredients: RecipeIngredientRequestDto[]
}

export interface RecipeIngredientRequestDto {
    ingredientid: number,
    quantity: number,
    unitid: number,
    todelete: boolean
}