import rp from 'request-promise'

var urls = {
  userProfile: 'url/to/userprofile/endpoint',
  userBookmarks: 'url/to/userbookmarks/endpoint',
  userNotes: 'url/to/userbookmarks/endpoint'
}

var tfacMgr = {}

/**
 * Fetches the user profile information from TFAC.
 * @param {integer} userId - The TFAC user id.
 * @return {Promis<Object>} A promise that resolve
 * into a user profile payload.
 */
tfacMgr.fetchUserProfile = (userId) => {
  var options = {
    method: 'GET',
    uri: urls.userProfile,
    json: true
        // Include here the auth key.
  }

  return rp(options)
                .then((response) => {
                    // Authenticate and return payload.
                  return response.payload
                })
                .catch((err) => {
                  console.error('Error while fetching the user profile from TFAC.')
                  return new Error(err)
                })
}

tfacMgr.fetchBookmarks = (userId) => {

}

tfacMgr.fetchNotes = (userId) => {

}

export default tfacMgr
