/* eslint-disable */

export default () => {
  // https://www.quantcast.com/gdpr/quantcast-choice-self-serve/
  // https://quantcast.zendesk.com/hc/en-us/articles/360003814853-Technical-Implementation-Guide
  // featureFlag-gdprConsent
  if (window.tabforacause.featureFlags.gdprConsent) {
    // IAB standard docs:
    // https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/CMP%20JS%20API%20v1.1%20Final.md#what-api-will-need-to-be-provided-by-the-cmp-
    // Can redisplay the consent UI with:
    // window.__cmp('displayConsentUi')
    var elem = document.createElement('script');
    elem.src = "https://quantcast.mgr.consensu.org/cmp.js";
    elem.async = true;
    elem.type = "text/javascript";
    var scpt = document.getElementsByTagName('script')[0];
    scpt.parentNode.insertBefore(elem, scpt);

    window.__cmp('init', {
      'Language': 'EN',
      'Display UI': 'inEU', // 'inEU', 'always', 'never'
      // 'service' for consenting only for this domain; 'global' if consenting for all web
      'Consent Scope': 'service',
      'Publisher Name': 'Tab for a Cause',
      'Publisher Logo': 'https://s3-us-west-2.amazonaws.com/prod-tab2017.gladly.io/static/media/logo.539ef9c6.svg',
      'Publisher Purpose IDs': [],
      'Min Days Between UI Displays': 30,
      'Non-Consent Display Frequency': 90,
      // Initial screen
      'Initial Screen Title Text': 'We value your privacy',
      'Initial Screen Body Text': 'We and our partners use technology such as cookies on our site to personalise content and ads, provide social media features, and analyse our traffic. Click below to consent to the use of this technology on Tab for a Cause. You can change your mind at any time by visiting your settings page.',
      'Initial Screen Reject Button Text': 'I do not accept',
      'Initial Screen Accept Button Text': 'I accept',
      'Initial Screen Purpose Link Text': 'Show Purposes',
      // Purpose screen
      'Purpose Screen Title Text': 'We value your privacy',
      'Purpose Screen Body Text': 'Tab for a Cause and our partners use technology such as cookies on our site to personalize content and ads, provide social media features, and analyze our traffic. You can toggle on or off your consent preference based on purpose for all companies listed under each purpose to the use of this technology on Tab for a Cause. You can change your mind and revisit your consent choices at anytime by visiting your settings page.',
      'Purpose Screen Enable All Button Text': 'Enable all purposes',
      'Purpose Screen Vendor Link Text': 'See full vendor list',
      'Purpose Screen Cancel Button Text': 'Cancel',
      'Purpose Screen Save and Exit Button Text': 'Save & Exit',
      // Vendor screen
      'Vendor Screen Title Text': 'We value your privacy',
      'Vendor Screen Body Text': 'Tab for a Cause and our partners use technology such as cookies on our site to personalize content and ads, provide social media features, and analyze our traffic. You can toggle on or off your consent preference for each company to the use of this technology on Tab for a Cause. You can change your mind and revisit your consent choices at anytime by visiting your settings.',
      'Vendor Screen Reject All Button Text': 'Reject All',
      'Vendor Screen Accept All Button Text': 'Accept All',
      'Vendor Screen Purposes Link Text': 'Back to purposes',
      'Vendor Screen Cancel Button Text': 'Cancel',
      'Vendor Screen Save and Exit Button Text': 'Save & Exit'
    });
  }
}