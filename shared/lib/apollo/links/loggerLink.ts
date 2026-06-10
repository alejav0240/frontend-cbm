import { ApolloLink, Observable, Operation, FetchResult } from "@apollo/client";

export const createLoggerLink = () => {
  return new ApolloLink((operation: Operation, forward) => {
    const { operationName, variables } = operation;
    const startTime = Date.now();

    console.debug(`[GraphQL] → ${operationName}`, {
      variables: process.env.NODE_ENV === "development" ? variables : undefined,
    });

    return new Observable<FetchResult>((observer) => {
      const subscription = forward(operation).subscribe({
        next: (result) => {
          const duration = Date.now() - startTime;
          if (result.errors?.length) {
            console.warn(`[GraphQL] ← ${operationName} (${duration}ms)`, {
              errors: result.errors,
            });
          } else {
            console.debug(`[GraphQL] ← ${operationName} (${duration}ms) ✓`);
          }
          observer.next(result);
        },
        error: (error) => {
          console.error(
            `[GraphQL] ← ${operationName} (${Date.now() - startTime}ms) ✗`,
            error,
          );
          observer.error(error);
        },
        complete: () => observer.complete(),
      });
      return () => subscription.unsubscribe();
    });
  });
};
