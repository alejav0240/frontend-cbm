// app/dashboard/page.tsx
'use client';

import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {useDashboardStore} from "@/shared/store/dashboardStore";

const GET_USER_STATS = gql`
query GetUserStats {
  users(search: "", roleName: "", pageSize: 10, page: 10, excludeRole: "") {
    totalCount
    totalPages
    currentPage
    results {
      firstName
      lastName
    }
  }
}
`;

export default function HomePage() {
  const { currentPage } = useDashboardStore();
  const { data, loading, error } = useQuery(GET_USER_STATS);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Home</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
              title="Total Users"
              value={(data as any)?.users.totalCount}
              color="blue"
          />
        </div>
      </div>
  );
}

const StatCard = ({ title, value, color }: any) => (
    <div className={`bg-white rounded-lg shadow p-6 border-t-4 border-${color}-500`}>
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
);