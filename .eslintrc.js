module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    // 'eslint:all',
    // 'eslint:recommended',
    'plugin:vue/vue3-recommended',
    // '@vue/eslint-config-typescript',
    '@vue/typescript/recommended',
    '@vue/prettier',
  ],
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    node: true,
    es6: true,
    'vue/setup-compiler-macros': true,
  },
  rules: {
    'no-multiple-empty-lines': 'error',
    'prefer-template': 'error',
    'spaced-comment': 'error',
    'no-var': 'error',
    'one-var-declaration-per-line': 'error',
    'no-multi-assign': 'error',
    eqeqeq: 'error',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
