export interface SearchUsers {
    id: string;
    fullname: string;
}
export interface SearchUserData {
    users:{
        results: SearchUsers[];
    };
};

export interface SearchUserFilter {
    search?: string;
    roleName?: string;
    pageSize?: number;
    excludeRole?: string;
    page?: number;
}