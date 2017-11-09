import { browserHistory } from 'react-router'

// TODO: replace this with Link navigation via react-router.

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
  goTo('/tab/settings/widgets/')
}

export const goToDonate = () => {
  goTo('/tab/profile/donate/')
}

export const goToDashboard = () => {
  goTo('/tab/')
}

export const goToRetrievePassword = () => {
  goTo('/tab/auth/recovery/')
}

export const goToStats = () => {
  goTo('/tab/profile/stats/')
}

export const goToInviteFriends = () => {
  goTo('/tab/profile/invite/')
}
