import rp from 'request-promise';

var urls = {
	setCognitoCredentials: 'http://tab.gladly.io/url/to/setcognitocredentials/endpoint',
};

var tfacMgr = {};

/**
 * Calls to TFAC to set the cognito credentials for a tfac user.
 * @param {integer} tfacUserId - The TFAC user id.
 * @param {Object} userCognito - The object containing the cognito credentials.
 * @return {Promise<Object>} A promise that resolve into a response.
 */
tfacMgr.setCognitoCredentials = (tfacUserId, userCognito) => {

	const data = {
	    tfacId: tfacUserId,
	    cognitoId: userCognito.sub,
	    email: userCognito.email,
	    password: userCognito.password
	};
	
	var options = {
		method: 'POST',
	    uri: urls.setCognitoCredentials,
	    json: true,
	    body: data,
	    //Include here the tfac auth key.
	};

	console.log('Call to tfac', options);
	 
	return rp(options)
			    .then((response) => response)
}

export default tfacMgr;