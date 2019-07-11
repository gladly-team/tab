// FIXME: the app works when built but not in
// development. We probably need to change more with
// the webpack config. Note that our changes renamed
// the main built file from main.[hash].js to
// index.[hash].js -- that change might be related.
const foo = () => {
  console.log('Hello world!')
}

foo()
