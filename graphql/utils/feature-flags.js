/* eslint-disable import/prefer-default-export */

export const isGlobalHealthGroupImpactEnabled = () =>
  process.env.GROWTHBOOK_ENV !== 'production'
