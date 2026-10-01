import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["coverage/**"] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    rules: {
      // The engine must stay deterministic: every random value comes from the document seed.
      "no-restricted-properties": [
        "error",
        { object: "Math", property: "random", message: "Use createRng(seed) from rng.ts." },
      ],
      "no-restricted-globals": [
        "error",
        { name: "document", message: "The engine must not touch the DOM." },
        { name: "window", message: "The engine must not touch the DOM." },
      ],
    },
  },
);
