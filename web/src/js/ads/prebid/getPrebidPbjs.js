export default () => {
  const pbjs = window.pbjs || {}
  // We're not running in global scope, so make sure to
  // assign to the window.
  if (!window.pbjs) {
    window.pbjs = pbjs
  }
  pbjs.que = pbjs.que || []
  return pbjs
}
