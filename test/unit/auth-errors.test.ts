import { describe, expect, it } from "vitest";
import { isAuthError } from "@/shared/lib/apollo/types";

describe("isAuthError", () => {
  it.each([
    { graphQLErrors: [{ message: "UNAUTHENTICATED" }] },
    { graphQLErrors: [{ message: "Token expired", extensions: { code: "token_expired" } }] },
    { networkError: { statusCode: 401 } },
    { networkError: { bodyText: JSON.stringify({ errors: [{ message: "No autenticado" }] }) } },
  ])("recognizes authentication failures", (error) => {
    expect(isAuthError({ message: "Authentication failed", ...error })).toBe(true);
  });

  it("does not classify unrelated GraphQL errors as authentication failures", () => {
    expect(
      isAuthError({
        message: "Validation failed",
        graphQLErrors: [{ message: "Invalid input", extensions: { code: "BAD_USER_INPUT" } }],
      }),
    ).toBe(false);
  });
});
