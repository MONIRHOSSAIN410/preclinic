import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  {
    rules: {
      // New strict rules in React 19 / Next 16 — keep as warnings for existing code
      "react-hooks/set-state-in-effect": "warn",
      "react/no-unescaped-entities": "warn",
    },
  },
  { ignores: [".next/**", "node_modules/**", "out/**"] },
];

export default eslintConfig;
