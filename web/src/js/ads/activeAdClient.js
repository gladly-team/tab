
export const getActiveAdServerName = function () {
  const adServerNameEnv = process.env.AD_CLIENT_NAME
  if (!adServerNameEnv) {
    throw new Error('Environment variable `AD_CLIENT_NAME` is not set.')
  }
  const adServerOptions = ['mock', 'dfp']
  if (adServerOptions.indexOf(adServerNameEnv) === -1) {
    throw new Error(`AD_CLIENT_NAME must be one of: ${adServerOptions}`)
  }
  return adServerNameEnv
}
