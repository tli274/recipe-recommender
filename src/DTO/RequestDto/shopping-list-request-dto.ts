export interface ShoppingListRequestDto {
    listid: number,
    iscompleted: boolean,
    createddate: Date,
    completiondate?: Date,
    notes: string,
    listname: string
}