SystemJS.config({
  baseURL: "/",
  // trace: true,
  production: true,
  paths: {
    "npm:*": "jspm_packages/npm/*",
    "uxon/": "lib/"
  }
});
