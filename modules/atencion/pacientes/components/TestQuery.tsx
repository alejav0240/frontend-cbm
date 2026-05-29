'use client';

import { useQuery, gql } from '@/shared/lib/apollo';
import { useEffect, useState } from 'react';

const TEST_QUERY = gql`
  query {
    __typename
  }`;

// ✅ Asegúrate de que sea export default
export default function TestQuery() {
  const { data, loading } = useQuery(TEST_QUERY);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (loading) return <div>Cargando...</div>;
  
  return <div>Apollo funciona: {(data as any)?.__typename}</div>;
}