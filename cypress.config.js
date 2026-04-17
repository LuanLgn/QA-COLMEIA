const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://teste-colmeia-qa.colmeia-corp.com',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: false,
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true
  },
});
