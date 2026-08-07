import type { CodegenConfig } from "@graphql-codegen/cli";
import { buildClientSchema, getIntrospectionQuery, printSchema } from "graphql";

const graphqlUrl =
  process.env.NEXT_PUBLIC_GRAPHQL_URI || "http://localhost:8000/graphql/";
const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || graphqlUrl.replace(/\/graphql\/?$/, "");

function getCsrfFromSetCookie(response: Response): string {
  const raw = response.headers.get("set-cookie") ?? "";
  const match = raw.match(/(?:^|,\s*)csrftoken=([^;,]+)/);
  return match ? match[1] : "";
}

async function cargarSchema(): Promise<string> {
  let csrf = "";
  try {
    const resCsrf = await fetch(`${baseUrl}/csrf/`, { credentials: "include" });
    csrf = getCsrfFromSetCookie(resCsrf);
  } catch {
    // el endpoint /csrf/ puede no existir; se intenta igual
  }

  const res = await fetch(graphqlUrl, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(csrf ? { Cookie: `csrftoken=${csrf}`, "X-CSRFToken": csrf } : {}),
    },
    body: JSON.stringify({
      query: getIntrospectionQuery({ descriptions: true }),
    }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL: ${res.status} ${await res.text()}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(
      `GraphQL introspection failed: ${JSON.stringify(json.errors)}`,
    );
  }

  return printSchema(buildClientSchema(json.data));
}

export default cargarSchema().then(
  (schema) =>
    ({
      overwrite: true,
      allowPartialOutputs: true,
      schema,
      documents: ["entities/**/*.ts", "shared/api/**/*.ts", "features/**/*.ts"],
      generates: {
        "shared/api/generated/": {
          preset: "client",
          plugins: [],
          presetConfig: {
            fragmentMasking: false,
          },
        },
      },
    }) satisfies CodegenConfig,
);
