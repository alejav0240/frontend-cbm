"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { createApolloClient } from "./createClient";
import { ensureCsrfToken } from "./utils/csrf";

export function ApolloWrapper({ children }: { children: ReactNode }) {
  const client = useMemo(() => createApolloClient(), []);

  // CSRF se obtiene en background — no bloqueamos el render
  useEffect(() => {
    ensureCsrfToken().catch((err) =>
      console.warn("[ApolloWrapper] CSRF init warning", err),
    );
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
