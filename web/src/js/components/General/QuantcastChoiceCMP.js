import React from 'react'
import { Helmet } from 'react-helmet'

// Quantcast Choice Consent Manager Tag
// https://www.quantcast.com/gdpr/quantcast-choice-self-serve/
// https://quantcast.zendesk.com/hc/en-us/articles/360003814853-Technical-Implementation-Guide
// IAB standard docs:
// https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/CMP%20JS%20API%20v1.1%20Final.md#what-api-will-need-to-be-provided-by-the-cmp-
// Can redisplay the consent UI with:
// window.__cmp('displayConsentUi')
class QuantcastChoiceCMP extends React.Component {
  constructor(props) {
    super(props)
    window.__cmp = (function() {
      return typeof window.__cmp === 'function'
        ? window.__cmp
        : function(c) {
            var b = arguments
            if (!b.length) {
              return window.__cmp.a
            } else if (c === '__cmp') return false
            else {
              if (typeof window.__cmp.a === 'undefined') {
                window.__cmp.a = []
              }
              window.__cmp.a.push([].slice.apply(b))
            }
          }
    })()
    window.__cmp('init', {
      Language: 'EN',
      'Display UI': 'inEU', // 'inEU', 'always', 'never'
      // 'service' for consenting only for this domain; 'global' if consenting for all web
      'Consent Scope': 'service',
      'Publisher Name': 'Tab for a Cause',
      'Publisher Logo':
        'https://tab.gladly.io/newtab/static/media/logo.539ef9c6.svg',
      'Publisher Purpose IDs': [],
      'Min Days Between UI Displays': 30,
      'Non-Consent Display Frequency': 90,
      // If true, displays a floating link on all pages
      'Display Persistent Consent Link': false,
      // Initial screen
      'Initial Screen Title Text': 'We value your privacy',
      'Initial Screen Body Text':
        'We and our partners use technology such as cookies on our site to personalise content and ads, provide social media features, and analyse our traffic. Click below to consent to the use of this technology on Tab for a Cause. You can change your mind at any time by visiting your settings page.',
      'Initial Screen Reject Button Text': 'I do not accept',
      'Initial Screen Accept Button Text': 'I accept',
      'Initial Screen Purpose Link Text': 'Show Purposes',
      // Purpose screen
      'Purpose Screen Title Text': 'We value your privacy',
      'Purpose Screen Body Text':
        'Tab for a Cause and our partners use technology such as cookies on our site to personalize content and ads, provide social media features, and analyze our traffic. You can toggle on or off your consent preference based on purpose for all companies listed under each purpose to the use of this technology on Tab for a Cause. You can change your mind and revisit your consent choices at anytime by visiting your settings page.',
      'Purpose Screen Enable All Button Text': 'Enable all purposes',
      'Purpose Screen Vendor Link Text': 'See full vendor list',
      'Purpose Screen Cancel Button Text': 'Cancel',
      'Purpose Screen Save and Exit Button Text': 'Save & Exit',
      // Vendor screen
      'Vendor Screen Title Text': 'We value your privacy',
      'Vendor Screen Body Text':
        'Tab for a Cause and our partners use technology such as cookies on our site to personalize content and ads, provide social media features, and analyze our traffic. You can toggle on or off your consent preference for each company to the use of this technology on Tab for a Cause. You can change your mind and revisit your consent choices at anytime by visiting your settings.',
      'Vendor Screen Reject All Button Text': 'Reject All',
      'Vendor Screen Accept All Button Text': 'Accept All',
      'Vendor Screen Purposes Link Text': 'Back to purposes',
      'Vendor Screen Cancel Button Text': 'Cancel',
      'Vendor Screen Save and Exit Button Text': 'Save & Exit',
    })
  }

  render() {
    return (
      <Helmet>
        <script
          type="text/javascript"
          src="https://quantcast.mgr.consensu.org/cmp.js"
          async={true}
        />
        <style>{`
          .qc-cmp-button,
          .qc-cmp-button.qc-cmp-secondary-button:hover {
            background-color: #9d4ba3 !important;
            border-color: #9d4ba3 !important;
          }
          .qc-cmp-button:hover,
          .qc-cmp-button.qc-cmp-secondary-button {
            background-color: transparent !important;
            border-color: #9d4ba3 !important;
          }
          .qc-cmp-alt-action,
          .qc-cmp-link {
            color: #9d4ba3 !important;
          }
          .qc-cmp-button,
          .qc-cmp-button.qc-cmp-secondary-button:hover {
            color: #FFF !important;
          }
          .qc-cmp-button:hover,
          .qc-cmp-button.qc-cmp-secondary-button {
            color: #9d4ba3 !important;
          }
          .qc-cmp-small-toggle.qc-cmp-toggle-on,
          .qc-cmp-toggle.qc-cmp-toggle-on {
            background-color: #d07ad5 !important;
            border-color: #d07ad5 !important;
          }
      `}</style>
      </Helmet>
    )
  }
}

QuantcastChoiceCMP.propTypes = {}
QuantcastChoiceCMP.propTypes = {}

export default QuantcastChoiceCMP
