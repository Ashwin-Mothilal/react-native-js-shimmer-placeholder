module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "@react-native-community"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks"],
  settings: {
    "react-native/style-sheet-object-names": ["StyleSheet", "AppStyleSheet"],
  },
  rules: {
    //Basic
    "comma-dangle": [0, "always-multiline"],
    "nonblock-statement-body-position": 0,
    "no-unused-expressions": 0,
    "no-extra-boolean-cast": 0,
    "no-case-declarations": 0,

    //Best Practices
    eqeqeq: [2, "always", { null: "ignore" }],
    curly: 0,
    "no-var": 2,
    "prefer-const": 2,

    // Stylistic Issues
    quotes: [2, "double", "avoid-escape"],
    semi: [2, "always"],

    // React
    "react/no-string-refs": 1,
    "react/prop-types": [1, { ignore: [] }],
    "react/jsx-uses-vars": 2,
    "react/jsx-sort-default-props": 1,
    "react/sort-prop-types": [
      1,
      { ignoreCase: false, callbacksLast: false, requiredFirst: false },
    ],

    // React hooks
    "react-hooks/rules-of-hooks": 2,
    "react-hooks/exhaustive-deps": [
      2,
      {
        additionalHooks: "useCode",
      },
    ],

    //React Native
    "react-native/no-inline-styles": 2,
    "react-native/no-unused-styles": 2,

    /*"import/no-extraneous-dependencies": ["warn", { devDependencies: true }]*/
  },
};
