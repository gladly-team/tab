
import idb from 'idb'

// Some users are in a broken state where the Firebase IndexedDB
// exists but there is a missing object store, and Firebase appears
// not to handle the missing object store. See:
// https://github.com/gladly-team/tab/issues/239
// This deletes the Firebase DB entirely to reset the state,
// hopefully allowing the users to sign in.
// The broken state is likely related to Firebase udpating and
// reversion (https://github.com/gladly-team/tab/pull/238), so
// we should remove this after it repairs the state for existing
// users.
export const checkForFirebaseIDBError = async () => {
  const firebaseDbName = 'firebaseLocalStorageDb'
  const firebaseAuthObjectStoreName = 'firebaseLocalStorage'
  try {
    const db = await idb.open(firebaseDbName)
    if (!db) {
      return
    }
    try {
      // Try to get the object store. If there's an error in the
      // IDB state, this will throw.
      const tx = db.transaction(firebaseAuthObjectStoreName, 'readonly')
      tx.objectStore(firebaseAuthObjectStoreName)
    } catch (e) {
      if (e.name === 'NotFoundError') {
        console.log('Firebase IDB is in a broken state; deleting DB.')
        db.close()
        return idb.delete(firebaseDbName)
      }
    }
  } catch (e) {
    console.error('Unexpected error when checking soundness of Firebase IDB', e)
  }
}
