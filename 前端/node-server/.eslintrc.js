module.exports = {
  root: true,
  globals: {
    document: true
  },
  rules: { 'no-underscore-dangle': 0, 'func-names': 0, 'no-plusplus': 0 },
  parserOptions: {
    "sourceType": "module",
    "ecmaVersion": 8,
    "ecmaFeatures": {
        "jsx": true,
        "experimentalObjectRestSpread": true
    }
},
}
