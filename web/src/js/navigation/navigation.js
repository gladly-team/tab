import { browserHistory } from 'react-router'

function goTo (route) {
  browserHistory.push(route)
}

function goToHome () {
  goTo('/tab/')
}

function goToLogin () {
  goTo('/tab/auth/login/')
}

function goToSettings () {
  goTo('/tab/settings/')
}

function goToSettingsSection (section) {
  goTo(`/tab/settings/${section}`)
}

function goToDonate () {
  goTo('/tab/donate/')
}

function goToDashboard () {
  goTo('/tab/')
}

function goToRetrievePassword () {
  goTo('/tab/auth/recovery/')
}

export {
  goToHome,
  goToLogin,
  goToSettings,
  goToSettingsSection,
  goToDonate,
  goToDashboard,
  goToRetrievePassword
}
