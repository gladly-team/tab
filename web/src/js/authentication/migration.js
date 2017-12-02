/* globals fetch */

import * as firebase from 'firebase'
import {
  setUsernameInLocalStorage
} from 'authentication/user'
import {
  goToDashboard
} from 'navigation/navigation'

// Handle migrating user from old auth provider.

/**
 * Get the current user's info from legacy Tab for a Cause.
 * @returns {Promise<(Object|null)>} A promise resolving into data for
 *   the existing user's session or null if no current user
 */
const fetchCurrentUserInfo = () => {
  const url = 'https://tab.gladly.io/api/migrate-auth/'
  return fetch(url, {
    method: 'POST'
  }).then(response => {
    return response.json()
      .then((response) => {
        const validUser = (
          response.username &&
          response.user_id &&
          response.pw &&
          response.pw !== '0' &&
          response.email
        )
        if (validUser) {
          return {
            username: response.username,
            email: response.email,
            pw: response.pw,
            userId: response.user_id
          }
        } else {
          console.log('User does not have info to autologin.')
          return null
        }
      })
      .catch((err) => {
        console.error(err)
        return null
      })
  })
}

export const attemptAutologin = () => {
  return fetchCurrentUserInfo()
    .then((userInfo) => {
      if (!userInfo) {
        return
      }

      firebase.auth()
        .signInWithEmailAndPassword(userInfo.email, userInfo.pw)
        .then(response => {
          // After log into Firebase, set username.
          setUsernameInLocalStorage(userInfo.username)

          // Redirect to the dashboard.
          goToDashboard()
        })
        .catch(err => {
          console.err(err)
        })
    })
    .catch((err) => console.error(err))
}
