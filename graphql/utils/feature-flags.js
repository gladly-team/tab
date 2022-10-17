export const isGlobalHealthGroupImpactEnabled = () =>
  process.env.GROWTHBOOK_ENV !== 'production'