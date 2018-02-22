
import * as firebase from 'firebase'

const config = {
  apiKey: 'abc123',
  authDomain: 'localhost',
  databaseURL: 'foo',
  projectId: 'xyz'
}
firebase.initializeApp(config)

// In Jest tests when mounting firebaseui-web, getting error:
// "The current environment does not support the specified persistence type"
// https://github.com/firebase/firebase-js-sdk/blob/369b411b52de56ad38c82993c9dca4b6bd7b82a4/packages/auth/src/authstorage.js#L106
// Should be able to set persistence to 'none' with:
//   firebase.auth()
//     .setPersistence(firebase.auth.Auth.Persistence.NONE)
// https://firebase.google.com/docs/auth/web/auth-state-persistence#supported_types_of_auth_state_persistence

// firebase.auth()
//   .setPersistence(firebase.auth.Auth.Persistence.NONE)
//   .then(() => {
//     console.log('Set Firebase persistence!')
//   })
