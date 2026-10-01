import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".next/**",
      "next-env.d.ts",
      "test-results/**",
      "playwright-report/**",
      ".lighthouseci/**",
    ],
  },
  ...nextVitals,
  ...nextTs,
];

export default config;
