const config = {
  ci: {
    collect: {
      startServerCommand: "npm run start",
      url: ["http://localhost:3000"],
      numberOfRuns: 3,
      settings: {
        chromeFlags: "--no-sandbox --disable-gpu --disable-background-networking --disable-component-update --disable-features=TranslateUI,OptimizationHints",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.85 }],
        "categories:seo": ["error", { minScore: 0.9 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};

module.exports = config;
