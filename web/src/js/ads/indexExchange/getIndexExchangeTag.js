// Expects we've set up Index Exchange's JS.
export default () => {
  const headertag = window.headertag || {}
  headertag.cmd = headertag.cmd || []
  // We're not running in global scope, so make sure to
  // assign to the window.
  if (!window.headertag) {
    window.headertag = headertag
  }
  return window.headertag
}
