
import { getGoogleTag } from './googleTag'

// Google Tag Manager
export default function () {
  // Make sure window.googletag is defined
  getGoogleTag()

  // Create the Google tag script
  var gads = document.createElement('script')
  gads.async = true
  gads.type = 'text/javascript'
  var useSSL = document.location.protocol === 'https:'
  gads.src = (useSSL ? 'https:' : 'http:') +
    '//www.googletagservices.com/tag/js/gpt.js'
  var head = document.getElementsByTagName('head')[0]
  head.appendChild(gads)
}
