
const DEBUG = true

var fbq = window.fbq
if (!fbq) {
  console.error('Facebook analytics are not available on `window.fbq`.')
}

const facebookAnalytics = (...args) => {
  try {
    if (DEBUG) {
      console.log('Logging Facebook event with args:', args)
    }
    fbq.apply(this, args)
  } catch (e) {
    console.error('Failed to track Facebook Analytics event.', e)
  }
}

export default facebookAnalytics
