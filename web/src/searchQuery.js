// This is a second entry point to speed up our query
// to fetch search results.
// We've patched react-scripts to add this as another entry
// point. After modifying files in react-scripts, commit the
// patches with:
// `yarn patch-package react-scripts`
const foo = () => {
  console.log('Hello world!')
}

foo()
