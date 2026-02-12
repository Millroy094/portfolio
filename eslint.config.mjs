import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "warn",
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", ".amplify/**"]),
]);
