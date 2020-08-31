import tabCMP from 'tab-cmp'
import logger from 'js/utils/logger'
import tabLogoWithText from 'js/assets/logos/logo-with-text.svg'

const initializeCMP = async () => {
  // Disable the CMP in the test environment. It currently breaks
  // acceptance tests.
  if (process.env.REACT_APP_CMP_ENABLED === 'true') {
    await tabCMP.initializeCMP({
      consent: {
        enabled: true,
        timeout: 500,
      },
      // Debugging can be enabled with URL param tabCMPDebug=true.
      debug: false,
      displayPersistentConsentLink: false,
      onError: err => {
        logger.error(err)
      },
      primaryButtonColor: '#9d4ba3',
      publisherName: 'Tab for a Cause',
      publisherLogo: tabLogoWithText,
    })
  }
}

export default initializeCMP
