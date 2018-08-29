/* eslint-env jest */

const navigationActual = require.requireActual('../navigation')

const navigationMock = navigationActual
navigationMock.goTo = jest.fn()
navigationMock.replaceUrl = jest.fn()
navigationMock.externalRedirect = jest.fn()
navigationMock.absoluteUrl = jest.fn(path => {
  return `https://tab-test-env.gladly.io${path}`
})
navigationMock.goToHome = jest.fn(() => {
  navigationMock.goTo(navigationMock.dashboardURL)
})
navigationMock.goToLogin = jest.fn(() => {
  navigationMock.replaceUrl(navigationMock.loginURL)
})
navigationMock.goToDashboard = jest.fn(() => {
  navigationMock.goTo(navigationMock.dashboardURL)
})
navigationMock.goToSettings = jest.fn(() => {
  navigationMock.goTo(navigationMock.settingsURL)
})
navigationMock.goToDonate = jest.fn(() => {
  navigationMock.goTo(navigationMock.donateURL)
})
navigationMock.goToStats = jest.fn(() => {
  navigationMock.goTo(navigationMock.statsURL)
})
navigationMock.goToInviteFriends = jest.fn(() => {
  navigationMock.goTo(navigationMock.inviteFriendsURL)
})

module.exports = navigationMock
