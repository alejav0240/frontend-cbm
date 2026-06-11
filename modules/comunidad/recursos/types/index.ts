export interface Recurso {
    id: string;
    title: string;
    type: string;
    category: string;
    url: string;
    typeDisplay: string;
}

export interface RecursoData {
    digitalResources: {
        results: Recurso[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
    };
}

export interface RecursoFilters {
    type: string;
    search: string;
    page: number;
    pageSize: number;
}