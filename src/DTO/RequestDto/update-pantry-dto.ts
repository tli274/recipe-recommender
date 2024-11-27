export interface UpdatePantryItemRequestDto 
{
    ingredientid: number;
    quantity: number;
    purchasedate: Date;
    expirationdate?: Date;
    units: number;
    notes: string;
}