import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig } from "eslint/config";
import { fileURLToPath } from "url";
import path from "path";

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize FlatCompat
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// ✅ THIS is the correct call — no nested array
const legacyConfigs = compat.extends("next/core-web-vitals").concat(
  compat.extends("next/typescript")
);

export default defineConfig([
  ...legacyConfigs,
  {
    ignores: [
      "**/node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
]);
