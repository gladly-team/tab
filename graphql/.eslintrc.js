module.exports = {
  root: true,
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'global-require': 0,
    'no-underscore-dangle': 0,
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
