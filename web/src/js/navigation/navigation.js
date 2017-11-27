import { browserHistory } from 'react-router'

// TODO: replace this with Link navigation via react-router.

// TODO: make all routes absolute by default
const protocol = process.env.WEBSITE_PROTOCOL ? process.env.WEBSITE_PROTOCOL : 'https'
const baseUrl = `${protocol}://${process.env.WEBSITE_DOMAIN}`

export const goTo = (location) => {
  browserHistory.push(location)
}

export const replaceUrl = (location) => {
  browserHistory.replace(location)
}

export const absoluteUrl = (path) => {
  return `${baseUrl}${path}`
}

// ROUTES

export const dashboardURL = '/tab/'

// Auth routes
export const loginURL = '/tab/auth/'
export const verifyEmailURL = '/tab/auth/verify-email/'
export const enterUsernameURL = '/tab/auth/username/'

// Settings and profile
export const settingsURL = '/tab/settings/widgets/'
export const donateURL = '/tab/profile/donate/'
export const statsURL = '/tab/profile/stats/'
export const inviteFriendsURL = '/tab/profile/invite/'

// CONVENIENCE FUNCTIONS

export const goToHome = () => {
  goTo('/tab/')
}

export const goToLogin = () => {
  // Use replace by default because likely redirecting when
  // user is not authenticated.
  replaceUrl(loginURL)
}

export const goToDashboard = () => {
  goTo(dashboardURL)
}

export const goToSettings = () => {
  goTo(settingsURL)
}

export const goToDonate = () => {
  goTo(donateURL)
}

export const goToStats = () => {
  goTo(statsURL)
}

export const goToInviteFriends = () => {
  goTo(inviteFriendsURL)
}
