import { onError } from "@apollo/client/link/error";
import { Observable } from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { TokenManager } from "../utils/tokenManager";
import { REFRESH_TOKEN_MUTATION } from "../operations/auth";
import { getApolloClient } from "../createClient";

const AUTH_CODES = [
  "UNAUTHENTICATED",
  "invalid_token",
  "token_expired",
  "authentication_required",
  "Unauthorized",
];

let isRefreshing = false;
type RefreshSubscriber = (success: boolean) => void;
let refreshQueue: RefreshSubscriber[] = [];

const flushRefreshQueue = (success: boolean): void => {
  refreshQueue.forEach((cb) => cb(success));
  refreshQueue = [];
};

const isAuthError = (error: unknown): boolean => {
  // GraphQL errors (Apollo v4)
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors.some(
      (e) =>
        AUTH_CODES.includes((e.extensions?.code as string) ?? "") ||
        AUTH_CODES.some((code) => e.message?.includes(code)),
    );
  }
  // Network / HTTP errors
  if (error instanceof Error && "statusCode" in error) {
    return (error as any).statusCode === 401;
  }
  return false;
};

export const createErrorLink = () => {
  return onError(({ error, operation, forward }) => {
    if (operation.operationName === "RefreshToken") return;
    if (!isAuthError(error)) return;
    if (typeof window !== "undefined" && window.location.pathname === "/login")
      return;

    console.debug("[Apollo] Auth error detected, attempting refresh...");

    if (isRefreshing) {
      return new Observable((observer) => {
        refreshQueue.push((success) => {
          if (success) forward(operation).subscribe(observer);
          else observer.error(error);
        });
      });
    }

    isRefreshing = true;

    return new Observable((observer) => {
      getApolloClient()
        .mutate({
          mutation: REFRESH_TOKEN_MUTATION,
          fetchPolicy: "network-only",
        })
        .then((response) => {
          TokenManager.handleRefreshSuccess(
            (response.data as any)?.refreshToken,
          );
          flushRefreshQueue(true);
          forward(operation).subscribe(observer);
        })
        .catch((refreshError) => {
          console.error("[Apollo] Token refresh failed", refreshError);
          TokenManager.handleRefreshFailure(refreshError);
          flushRefreshQueue(false);
          observer.error(refreshError);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  });
};
