SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json"
  ],
  globalEvaluationScope: false,
  transpiler: "plugin-babel",

  map: {
    "plugin-babel": "npm:systemjs-plugin-babel@0.0.2"
  },

  packages: {
    "uxon": {
      main: "main.js"
    }
  }
});
