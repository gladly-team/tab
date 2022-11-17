module.exports = {
  root: true,
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'global-require': 0,
    'no-underscore-dangle': 0,
    // TODO: reenable these rules after cleaning code:
    'prefer-object-spread': 0,
    'arrow-body-style': 0,
    'no-useless-catch': 0,
    'import/no-useless-path-segments': 0,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  env: {
    es6: true,
  },
  settings: {
    react: {
      version: '18',
    },
  },
}
