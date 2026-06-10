// main Provider
"use client";

import { ThemeProvider } from "@/config/providers/theme-provider";
import { Toaster } from "sonner";
import { ApolloWrapper } from "@/shared/lib/apollo";

export function MainProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ApolloWrapper>{children}</ApolloWrapper>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}
