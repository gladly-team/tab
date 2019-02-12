// Returns whether react-snap is the one running the app.
// This is useful to adjust what we want to prerender.
// https://github.com/stereobooster/react-snap/issues/245#issuecomment-414347911
export const isReactSnapClient = () => {
  try {
    return navigator.userAgent === 'ReactSnap'
  } catch (e) {
    return false
  }
}
