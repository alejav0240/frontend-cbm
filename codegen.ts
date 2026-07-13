import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  allowPartialOutputs: true,
  schema: "http://localhost:8000/graphql/",
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
};

export default config;
