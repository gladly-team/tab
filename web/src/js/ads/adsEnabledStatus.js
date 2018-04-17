
export default () => {
  if (!(process.env.ADS_ENABLED === 'true')) {
    return false
  }
  return true
}
