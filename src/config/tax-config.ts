export const TAX_CONFIG = {
  version: "AY2025-26-v1",
  updatedAt: "2025-07-01",

  taxFreeThreshold: {
    general: 350000,
    womenAndSenior: 400000,
    disabledAndThirdGender: 475000,
  },

  slabs: [
    { upTo: 100000, rate: 0.05 },
    { upTo: 400000, rate: 0.10 },
    { upTo: 500000, rate: 0.15 },
    { upTo: 500000, rate: 0.20 },
    { rate: 0.25 },
  ],

  consolidatedAllowanceMax: 450000,
  consolidatedAllowanceFraction: 1 / 3,

  investmentRebate: {
    maxFraction: 0.30,
    maxAmount: 15000000,
    rebateRate: 0.15,
  },

  minimumTax: {
    dhakaChattogram: 5000,
    otherCityCorp: 4000,
    otherAreas: 3000,
  },
} as const

export type TaxConfig = typeof TAX_CONFIG
