import { browserHistory } from 'react-router'

export const goTo = (route) => {
  browserHistory.push(route)
}

export const goToHome = () => {
  goTo('/tab/')
}

export const goToLogin = () => {
  goTo('/tab/auth/login/')
}

export const goToSettings = () => {
  goTo('/tab/settings/')
}

export const goToSettingsSection = (section) => {
  goTo(`/tab/settings/${section}/`)
}

export const goToDonate = () => {
  goTo('/tab/donate/')
}

export const goToDashboard = () => {
  goTo('/tab/')
}

export const goToRetrievePassword = () => {
  goTo('/tab/auth/recovery/')
}

export const goToStats = () => {
  // TODO
}

export const goToInviteFriends = () => {
  // TODO
}
