export interface AlertMessage {
    title: string,
    message: string,
    type: AlertType
}

export enum AlertType {
    success,
    error
}