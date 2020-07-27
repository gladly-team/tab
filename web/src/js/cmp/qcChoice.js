/* eslint-disable */
/*
  The dev-tab2017.gladly.io version of Quantcast Choice.
  Source:
  https://quantcast.mgr.consensu.org/choice/FPBLJYpJgR9Zu/dev-tab2017.gladly.io/choice.js
  Modified:
  - Removed script tag creation to load QC CMP JS, which we will
    host ourselves.
*/
;(function() {
  ;(function() {
    var firstScript = document.getElementsByTagName('script')[0]
    window._qevents = window._qevents || []
    ;(function() {
      var elem = document.createElement('script')
      elem.src =
        (document.location.protocol == 'https:'
          ? 'https://secure'
          : 'http://edge') + '.quantserve.com/quant.js'
      elem.async = true
      elem.type = 'text/javascript'
      var scpt = document.getElementsByTagName('script')[0]
      scpt.parentNode.insertBefore(elem, scpt)
    })()
    var qcaccount = 'p-' + 'FPBLJYpJgR9Zu'
    window._qevents.push({ qacct: qcaccount, source: 'choice' })
    var cmpNoScriptElement = document.createElement('noscript')
    var div = document.createElement('div')
    div.style = 'display:none;'
    var img = document.createElement('img')
    img.src = '//pixel.quantserve.com/pixel/p-' + 'FPBLJYpJgR9Zu' + '.gif'
    img.border = '0'
    img.height = '1'
    img.width = '1'
    img.alt = 'Quantcast'
    div.appendChild(img)
    cmpNoScriptElement.appendChild(div)
    firstScript.parentNode.insertBefore(cmpNoScriptElement, firstScript)
  })()
  ;(function() {
    var css = ''
    '' +
      ' .qc-cmp-button { ' +
      '   background-color: #9d4ba3 !important; ' +
      '   border-color: #9d4ba3 !important; ' +
      ' } ' +
      ' .qc-cmp-button:hover { ' +
      '   border-color: #9d4ba3 !important; ' +
      ' } ' +
      ' .qc-cmp-alt-action, ' +
      ' .qc-cmp-link { ' +
      '   color: #9d4ba3 !important; ' +
      ' } ' +
      ' .qc-cmp-button.qc-cmp-secondary-button:hover { ' +
      '   background-color: #9d4ba3 !important; ' +
      '   border-color: #9d4ba3 !important; ' +
      ' } ' +
      ' .qc-cmp-button.qc-cmp-secondary-button:hover { ' +
      '   color: #ffffff !important; ' +
      ' } ' +
      ' .qc-cmp-button.qc-cmp-secondary-button { ' +
      '   color: #368bd6 !important; ' +
      ' } ' +
      ' .qc-cmp-button.qc-cmp-secondary-button { ' +
      '   background-color: #eee !important; ' +
      '   border-color: transparent !important; ' +
      ' } ' +
      '' +
      ''
    var stylesElement = document.createElement('style')
    var re = new RegExp('&quote;', 'g')
    css = css.replace(re, '"')
    stylesElement.type = 'text/css'
    if (stylesElement.styleSheet) {
      stylesElement.styleSheet.cssText = css
    } else {
      stylesElement.appendChild(document.createTextNode(css))
    }
    var head = document.head || document.getElementsByTagName('head')[0]
    head.appendChild(stylesElement)
  })()
  var autoDetectedLanguage = 'en'
  function splitLang(lang) {
    return lang.length > 2 ? lang.split('-')[0] : lang
  }
  function isSupported(lang) {
    var langs = [
      'en',
      'fr',
      'de',
      'it',
      'es',
      'da',
      'nl',
      'el',
      'hu',
      'pt',
      'ro',
      'fi',
      'pl',
      'sk',
      'sv',
      'no',
      'ru',
      'bg',
      'ca',
      'cs',
      'et',
      'hr',
      'lt',
      'lv',
      'mt',
      'sl',
      'tr',
      'zh',
    ]
    return langs.indexOf(lang) === -1 ? false : true
  }
  if (isSupported(splitLang(document.documentElement.lang))) {
    autoDetectedLanguage = splitLang(document.documentElement.lang)
  } else if (isSupported(splitLang(navigator.language))) {
    autoDetectedLanguage = splitLang(navigator.language)
  }
  var choiceMilliSeconds = new Date().getTime()
  window.__tcfapi('init', 2, function() {}, {
    premiumProperties: {},
    coreUiLabels: {},
    premiumUiLabels: {
      uspDnsText: [
        '<p>We, and our partners, use technologies to process personal information, including IP addresses, pseudonymous identifiers associated with cookies, and in some cases mobile ad IDs. This information is processed to personalize content based on your interests, run and optimize marketing campaigns, measure the performance of ads and content, and derive insights about the audiences who engage with ads and content. This data is an integral part of how we raise money for non-profit partners, make revenue to support our staff, and generate relevant content for our audience. You can learn more about our data collection and use practices in our Privacy Policy.</p><br/><p>If you wish to request that your personal information is not shared with third parties, please click on the below checkbox and confirm your selection. Please note that after your opt out request is processed, we may still collect your information in order to operate our site.</p>',
      ],
    },
    theme: { uxPrimaryButtonColor: '#9d4ba3' },
    coreConfig: {
      initScreenBodyTextOption: 1,
      consentScope: 'service group',
      lang_: 'en',
      defaultToggleValue: 'off',
      displayUi: 'inEU',
      displayPersistentConsentLink: true,
      initScreenRejectButtonShowing: false,
      publisherLogo:
        'https://dev-tab2017.gladly.io/static/logo-with-text-257bbffc6dcac5076e8ac31eed8ff73c.svg',
      publisherPurposeIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      publisherPurposeLegitimateInterestIds: [2],
      publisherSpecialPurposesIds: [1, 2],
      publisherFeaturesIds: [],
      publisherSpecialFeaturesIds: [],
      stacks: [16, 10],
      softOptInEnabled: false,
      uiLayout: 'popup',
      vendorListUpdateFreq: 90,
      consentScopeGroupURL:
        'https://dev-tab2017.gladly.io/cmp-communication.html',
      thirdPartyStorageType: 'iframe',
      showSummaryView: true,
      persistentConsentLinkLocation: 4,
      quantcastAccountId: 'FPBLJYpJgR9Zu',
      privacyMode: ['GDPR', 'USP'],
      hashCode: 'sl5wPOJAKjpGqdc3QE1lKw',
      uspVersion: 1,
      uspJurisdiction: ['US'],
      uspLspact: 'N',
      publisherName: 'Dev - Tab for a Cause',
      publisherCountryCode: 'US',
      suppressCcpaLinks: true,
    },
  })
})()
