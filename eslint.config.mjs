/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "build/**", "out/**"],
  },
];

export default eslintConfig;
