export interface Role {
    id: string;
    name: string;
    permissions: string[];
    usersCount: number;
}

export interface RoleData {
    roles: Role[];
}

export interface RoleSearch {
    id: string;
    name: string;
}