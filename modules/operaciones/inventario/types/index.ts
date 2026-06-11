export interface item{
    id: string;
    name: string;
    type: string;
    "condition": string;
    "status": string;
    "room": string;
    "statusDisplay": string;
}

export interface inventoryItems  {
    inventoryItems: item[];
}

export interface inventoryFilters {
    status: string;
    type: string;
}