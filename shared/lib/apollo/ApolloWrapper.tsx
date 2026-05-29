'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { createApolloClient } from './createClient';
import { ensureCsrfToken } from './utils/csrf';

export function ApolloWrapper({ children }: { children: ReactNode }) {
    const client = useMemo(() => createApolloClient(), []);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        ensureCsrfToken()
            .catch((err) => console.warn('[ApolloWrapper] CSRF init warning', err))
            .finally(() => setReady(true));
    }, []);

    if (!ready) return null;

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
}
