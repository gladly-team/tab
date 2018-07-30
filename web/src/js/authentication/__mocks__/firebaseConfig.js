
import firebase from 'firebase/app'
import 'firebase/auth'

const config = {
  apiKey: 'abc123',
  authDomain: 'localhost',
  databaseURL: 'foo',
  projectId: 'xyz'
}

export const initializeFirebase = () => {
  firebase.initializeApp(config)
}
