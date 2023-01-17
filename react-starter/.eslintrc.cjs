module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    //hooksのルールの有効化 https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb#eslint-config-airbnb
    'airbnb/hooks',
    //typescriptに関するルールの有効化 https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    //prettierとの競合の回避 https://github.com/prettier/eslint-config-prettier
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    //import順のルールを絶対パスでのimportに対応する形に変更
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
          },
        ],
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        'newlines-between': 'always',
      },
    ],

    //default export推奨はoff
    'import/prefer-default-export': ['off'],

    //未使用変数のルールをtypescriptに対応した形に & 未使用の引数は _ から始まる変数であれば許容
    'no-unused-vars': ['off'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],

    //importの拡張子のルールをtypescriptに対応した形に
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],

    //test、mock系はdevDependenciesのインポートを許容
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/{__tests__,__mocks__}/**',
          '**/*.{stories,test}.{js,cjs,mjs,jsx,ts,tsx}',
          'src/testing/**',
        ],
      },
    ],

    //voidをstatementとしての利用を許容（useEffect内で `void Promise返す関数()` を想定）
    'no-void': [
      'error',
      {
        allowAsStatement: true,
      },
    ],

    //React18にそぐわないルールはoff
    'react/react-in-jsx-scope': ['off'],
    'react/prop-types': ['off'],
    'react/require-default-props': ['off'],

    //JSXの利用は、特定の拡張子のみ許容
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.jsx', '.tsx'],
      },
    ],
    //react-hook-formの register をスプレッド構文でpropsに渡したいためルールをoff
    'react/jsx-props-no-spreading': ['off'],

    //コンポーネントはアロー関数の形で
    'react/function-component-definition': [
      'error',
      {
        namedComponents: ['arrow-function'],
        unnamedComponents: ['arrow-function'],
      },
    ],

    //式の場合は空のfragmentを許容（<>{hoge}</>は許容）
    'react/jsx-no-useless-fragment': [
      'error',
      {
        allowExpressions: true,
      },
    ],

    //labelに対する制御コンポーネントを独自コンポーネントに
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        controlComponents: ['TextInput', 'TextArea'],
        assert: 'either',
      },
    ],
  },

  settings: {
    //eslint-plugin-importのTypescript対応 https://github.com/alexgorbatchev/eslint-import-resolver-typescript
    'import/resolver': {
      typescript: {},
    },
  },
}
