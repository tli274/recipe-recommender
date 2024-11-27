export interface ShoppingItemRequestDto {
    listid: number,
    ingredientid: number,
    prices?: number,
    quantity?: number,
    priority: number,
    units: number,
    incart: boolean,
    notes: string
}