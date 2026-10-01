/**
 * Lighthouse CI: mobile emulation with simulated slow 4G (Lighthouse defaults). Budgets: PLAN §4.
 * Landing LCP < 1.8 s. Studio LCP <= 2.5 s (Core Web Vitals "good"): the Studio carries the
 * printed-grain texture, and its LCP varies 1.7-2.4 s with framework JS alone.
 */
const base = "http://127.0.0.1:3230";

// Lantern's simulated LCP is bimodal here (~1.7 s or ~1.9-2.4 s for the same build, depending
// on whether the observed paint lands before framework JS). Gates check the best of 3 runs
// ("optimistic", LHCI's default, stated explicitly); docs/BUILD-LOG.md reports the medians too.
const shared = {
  "categories:performance": ["error", { minScore: 0.95 }],
  "categories:accessibility": ["error", { minScore: 0.95 }],
  "categories:best-practices": ["error", { minScore: 0.95 }],
  "categories:seo": ["error", { minScore: 0.9 }],
  "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
  "total-blocking-time": ["error", { maxNumericValue: 150 }],
};

module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm exec next start -p 3230",
      startServerReadyPattern: "Ready",
      url: [`${base}/`, `${base}/studio/effects`, `${base}/en/studio/3d`],
      numberOfRuns: 3,
      settings: { chromeFlags: "--no-sandbox --headless=new" },
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: "^http://127\\.0\\.0\\.1:3230/(en)?$",
          assertions: {
            ...shared,
            "largest-contentful-paint": ["error", { maxNumericValue: 1800 }],
          },
        },
        {
          matchingUrlPattern: "/studio/",
          assertions: {
            ...shared,
            "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
          },
        },
      ],
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci/reports" },
  },
};
