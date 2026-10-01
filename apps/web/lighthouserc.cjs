/** Lighthouse CI: mobile emulation with simulated slow 4G (Lighthouse defaults). PLAN §4. */
module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm exec next start -p 3230",
      startServerReadyPattern: "Ready",
      url: [
        "http://127.0.0.1:3230/",
        "http://127.0.0.1:3230/studio/effects",
        "http://127.0.0.1:3230/en/studio/3d",
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: "--no-sandbox --headless=new",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2000 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
        "total-blocking-time": ["error", { maxNumericValue: 150 }],
      },
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci/reports" },
  },
};
