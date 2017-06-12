
var tfacMgr = {};

/**
 * Calls to TFAC to set the cognito credentials for a tfac user.
 * @param {integer} tfacUserId - The TFAC user id.
 * @param {Object} userCognito - The object containing the cognito credentials.
 * @return {Promise<Object>} A promise that resolve into a response.
 */
tfacMgr.setCognitoCredentials = (tfacUserId, userCognito) => {
	return Promise.resolve({});
}

export default tfacMgr;