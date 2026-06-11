import {RoleSearch} from "@/modules/sistema/roles/types";

export interface SearchUsers {
  id: string;
  fullName: string;
}

export interface SearchUserData {
  users: {
    results: SearchUsers[];
  };
}

export interface SearchUserFilter {
  search?: string;
  roleName?: string;
  pageSize?: number;
  excludeRole?: string;
  page?: number;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  fullName: string;
  isActive: boolean;
  celular: number;
  status: boolean;
  foto: string;
  ci: number;
  role: RoleSearch
}

export interface UsersResponse {
  users: {
    results: UserData[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
}