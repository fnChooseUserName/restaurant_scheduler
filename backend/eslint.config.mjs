import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json"
      },
      globals: {
        ...globals.node,
        ...globals.jest
      }
    }
  }
);
