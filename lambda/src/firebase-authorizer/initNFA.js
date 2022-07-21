import { init } from 'next-firebase-auth'

const initAuth = ({
  firebaseProjectId,
  firebasePrivateKey,
  firebaseClientEmail,
  firebaseDatabaseURL,
  firebasePublicAPIKey,
  cookieKeys = [],
}) => {
  init({
    debug: false,
    firebaseAdminInitConfig: {
      credential: {
        projectId: firebaseProjectId,
        clientEmail: firebaseClientEmail,
        privateKey: firebasePrivateKey,
      },
      databaseURL: firebaseDatabaseURL,
    },
    firebaseClientInitConfig: {
      apiKey: firebasePublicAPIKey,
    },
    cookies: {
      name: 'TabAuth',
      keys: cookieKeys,
      secure: true,
      signed: true,
    },
  })
}

export default initAuth
