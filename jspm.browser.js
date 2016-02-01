SystemJS.config({
  baseURL: "/",
  production: true,
  paths: {
    "npm:*": "jspm_packages/npm/*",
    "uxon/": "lib/"
  }
});
