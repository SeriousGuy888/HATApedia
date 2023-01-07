export default {
  extends: ["eslint:recommended", "next/core-web-vitals"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: ["@mui/*/*/*"],
      },
    ],
  },
}
