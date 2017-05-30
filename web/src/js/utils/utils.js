
function validateEmail(email) {
    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
}

function validateCode(code) {
	return (new RegExp('^\\d+$')).test(code);
}

function validatePassword(password, config) {
	var regex = {
		lowercase: "^(?=.*[a-z])",
		uppercase: "^(?=.*[A-Z])",
		numeric: "^(?=.*[0-9])",
		special: "^(?=.*[!@#\$%\^&\*])",
	};

	if(config.minSize) {
		regex['minSize'] = "^(?=.{" + config.minSize + ",})";
	}

	const result = {
		valid: true,
	};

	for(var prop in config) {
		if(config[prop] && regex[prop]) {
			result[prop] = (new RegExp(regex[prop])).test(password)
			if(!result[prop]) 
				result.valid = false;
		} else {
			result[prop] = true;
		}
	}	
	
	return result;
}

export {
	validateEmail,
	validatePassword,
	validateCode
}