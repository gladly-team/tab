import localStorageMgr from './localstorage-mgr'

const localKeys = {
  BACKGROUND_OPTION: 'background-option',
  CUSTOM_IMAGE: 'custom-image',
  BACKGROUND_COLOR: 'background-color',
  BACKGROUND_IMAGE_URL: 'background-image-url'
}

function getValue (value) {
  if (value === 'null' || value === 'undefined') {
    return null
  }
  return value
}

const localBkgStorageMgr = {}

localBkgStorageMgr.getLocalBkgSettings = function () {
  var localSettings = null
  try {
    localSettings = {
      backgroundOption: getValue(localStorageMgr.getItem(localKeys.BACKGROUND_OPTION)),
      customImage: getValue(localStorageMgr.getItem(localKeys.CUSTOM_IMAGE)),
      backgroundColor: getValue(localStorageMgr.getItem(localKeys.BACKGROUND_COLOR)),
      backgroundImage: {
        imageURL: getValue(localStorageMgr.getItem(localKeys.BACKGROUND_IMAGE_URL))
      }
    }
  } catch (e) {
    console.log('Error while getting the local bkg settings.', e)
    localSettings = null
  }
  return localSettings
}

localBkgStorageMgr.setLocalBkgSettings = function (user) {
  try {
    localStorageMgr.setItem(localKeys.BACKGROUND_OPTION, user.backgroundOption)
    localStorageMgr.setItem(localKeys.CUSTOM_IMAGE, user.customImage)
    localStorageMgr.setItem(localKeys.BACKGROUND_COLOR, user.backgroundColor)
    localStorageMgr.setItem(localKeys.BACKGROUND_IMAGE_URL, user.backgroundImage.imageURL)
  } catch (e) {
    console.log('Error while setting the local bkg settings.', e)
  }
}

localBkgStorageMgr.shouldUpdateLocalBkgSettings = function (user) {
  var shouldUpdate = false
  try {
    const currentSettings = this.getLocalBkgSettings()
    shouldUpdate = currentSettings.backgroundOption !== user.backgroundOption ||
             currentSettings.customImage !== user.customImage ||
             currentSettings.backgroundColor !== user.backgroundColor ||
             currentSettings.backgroundImage.imageURL !== user.backgroundImage.imageURL
  } catch (e) {
    console.log('Error while checking if should update local bkg settings', e)
  }
  return shouldUpdate
}

export default localBkgStorageMgr
