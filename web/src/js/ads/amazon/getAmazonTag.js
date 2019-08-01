// Debugging apstag.
require('./apstag-v7.31.04')

// Expects we've set up Amazon's apstag JS before this.
export default () => {
  return window.apstag
}
