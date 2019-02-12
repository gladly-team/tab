import { cloneDeep } from 'lodash/lang'

// This exports the configuration we pass to YPA ads
// when fetching search results. This must be a plain
// object because we stringify it to prerender the
// first ads fetch as an inline script.

// Important: to modify some styles within the iframe, we
// pass an external stylesheet URL to the YPA API below.
// This file lives in web/public/. It does not get a hash
// appended to its filename, so we should rename it when
// it's modified. We should only add CSS to this external
// stylesheet when absolutely necessary.
const searchExternalCSSLink =
  'https://tab.gladly.io/search/search-2018.29.11.16.35.css'

const backgroundColor = '#fff'
const fontFamily = "'Roboto', arial, sans-serif"
const grey = '#aaa'
const resultStyle = {
  adSpacing: 26,
  lineSpacing: 18,
  title: {
    fontSize: 18,
    color: '#1a0dab',
    underline: false,
    bold: false,
    onHover: {
      color: '#1a0dab',
      underline: true,
    },
  },
  description: {
    fontSize: 13,
    color: '#505050',
    underline: false,
    bold: false,
    onHover: {
      color: '#505050',
      underline: false,
    },
  },
  URL: {
    fontSize: 13,
    color: '#007526',
    underline: false,
    bold: false,
    onHover: {
      color: '#007526',
      underline: false,
    },
  },
}

const templateStyles = {
  AdUnit: {
    backgroundColor: backgroundColor,
    borderColor: backgroundColor,
    lineSpacing: resultStyle.lineSpacing, // valid values: 8-25
    adSpacing: resultStyle.adSpacing, // valid values: 5-30
    font: fontFamily,
    urlAboveDescription: true,
    // How many lines to show the ad on.
    // adLayout: 3,
    // Additional CSS to apply within the YPA iframe.
    cssLink: searchExternalCSSLink,
  },
  // The "Ads" label.
  AdUnitLabel: {
    position: 'Top Left',
    fontsize: 11, // valid values: 6-24
    color: grey,
  },
  Title: {
    fontsize: resultStyle.title.fontSize,
    color: resultStyle.title.color,
    underline: resultStyle.title.underline,
    bold: resultStyle.title.bold,
    onHover: {
      color: resultStyle.title.onHover.color,
      underline: resultStyle.title.onHover.underline,
    },
  },
  Description: {
    fontsize: resultStyle.description.fontSize,
    color: resultStyle.description.color,
    underline: resultStyle.description.underline,
    bold: resultStyle.description.bold,
    onHover: {
      color: resultStyle.description.onHover.color,
      underline: resultStyle.description.onHover.underline,
    },
  },
  URL: {
    fontsize: resultStyle.URL.fontSize,
    color: resultStyle.URL.color,
    underline: resultStyle.URL.underline,
    bold: resultStyle.URL.bold,
    onHover: {
      color: resultStyle.URL.onHover.color,
      underline: resultStyle.URL.onHover.underline,
    },
  },
  LocalAds: {
    fontsize: resultStyle.description.fontSize,
    color: grey,
    underline: resultStyle.description.underline,
    bold: resultStyle.description.bold,
    onHover: {
      color: resultStyle.description.onHover.color,
      underline: resultStyle.description.onHover.underline,
    },
  },
  MerchantRating: {
    fontsize: resultStyle.description.fontSize,
    color: grey,
    underline: resultStyle.description.underline,
    bold: resultStyle.description.bold,
    onHover: {
      color: resultStyle.description.onHover.color,
      underline: resultStyle.description.onHover.underline,
    },
  },
  SiteLink: {
    fontsize: resultStyle.description.fontSize,
    color: resultStyle.title.color, // same as title
    underline: resultStyle.description.underline,
    bold: resultStyle.description.bold,
    onHover: {
      // Same as title
      color: resultStyle.title.onHover.color,
      underline: resultStyle.title.onHover.underline,
    },
  },
  EnhancedSiteLink: {
    fontsize: resultStyle.description.fontSize,
    color: resultStyle.title.color, // same as title
    underline: resultStyle.description.underline,
    bold: resultStyle.description.bold,
    onHover: {
      // Same as title
      color: resultStyle.title.onHover.color,
      underline: resultStyle.title.onHover.underline,
    },
  },
  SmartAnnotations: {
    fontsize: resultStyle.description.fontSize,
    color: grey,
    underline: resultStyle.description.underline,
    bold: resultStyle.description.bold,
    onHover: {
      color: resultStyle.description.onHover.color,
      underline: resultStyle.description.onHover.underline,
    },
  },
  ImageInAds: {
    align: 'right',
    size: '50x50',
  },
  OfficialSiteBadge: {
    fontsize: resultStyle.description.fontSize,
    color: backgroundColor,
    backgroundColor: grey,
  },
  CallExtension: {
    fontsize: resultStyle.description.fontSize,
    color: resultStyle.title.color, // same as title
    underline: resultStyle.description.underline,
    bold: resultStyle.description.bold,
    onHover: {
      // Same as title
      color: resultStyle.title.onHover.color,
      underline: resultStyle.title.onHover.underline,
    },
  },
}

const adOptions = {
  // The ad start rank and the ad end rank in the list of
  // search results.
  AdRange: '1-3',
  // Whether to show favicons near ads.
  Favicon: false,
  // Whether to show local ads.
  LocalAds: true,
  // Whether to use the "long ad title".
  Lat: true,
  // Whether to show "site links" in ads.
  SiteLink: true,
  // Whether to show merchant star ratings on ads.
  MerchantRating: true,
  // Whether to show images in ads.
  ImageInAds: false,
  // Whether to show "enhanced site links" in ads.
  EnhancedSiteLink: true,
  // Whether to show "smart annotations" in ads.
  SmartAnnotations: false,
  // Whether to show an "official site badge" next to ads
  // with a verified site.
  OfficialSiteBadge: true,
  // Whether to show an option to call the businesses next
  // to their ads.
  CallExtension: true,
  // Not in YPA documentation. Wheteher to show an
  // advertiser-selected review quote.
  ReviewExtension: false,
  // Not in YPA documentation. Wheteher to show a number
  // of keywords that look mostly unhelpful.
  CalloutExtension: false,
}

const YPAConfiguration = {
  // The calling function may set the query object, or YPA will
  // use the "q" URL parameter value.
  // ypaPubParams: {
  //   query: query,
  // },
  ypaAdTagOptions: {
    adultFilter: false, // false means do not allow adult ads
  },
  ypaAdConfig: '00000129a',
  ypaAdTypeTag: '',
  // For now, we'll just show non-personalized ads in the EU:
  // "When gdpr=0 or missing, Oath will perform an IP check on the user
  // to determine jurisdiction. If euconsent is empty, or if the IAB string
  // is missing, Oath will return non-personalized search ads and search web
  // results."
  // gdpr: false
  // euconsent: '',
  ypaAdSlotInfo: [
    {
      ypaAdSlotId: 'GY_Top_Center',
      ypaAdDivId: 'search-ads',
      ypaAdWidth: '600',
      ypaAdHeight: '891',
      // Callback function for when there are no ads.
      // ypaOnNoAd: foo,
      ypaSlotOptions: {
        AdOptions: {
          Mobile: Object.assign({}, cloneDeep(adOptions), {
            AdRange: '1-2',
          }),
          DeskTop: Object.assign({}, cloneDeep(adOptions)),
        },
        TemplateOptions: {
          Mobile: cloneDeep(templateStyles),
          DeskTop: cloneDeep(templateStyles),
        },
      },
    },
    {
      ypaAdSlotId: 'GY_Algo',
      ypaAdDivId: 'search-results',
      ypaAdWidth: '600',
      ypaAdHeight: '827',
      // Callback function for when there are no search results.
      // The calling function should set this callback.
      // ypaOnNoAd: onNoResults,
      ypaSlotOptions: {
        TemplateOptions: {
          Mobile: cloneDeep(templateStyles),
          DeskTop: cloneDeep(templateStyles),
        },
      },
    },
  ],
}

export default YPAConfiguration
