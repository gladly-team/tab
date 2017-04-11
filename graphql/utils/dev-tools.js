import config from '../config/environment';
const logger = {};

logger.error = function(msg, error) {
	console.error(msg, error);
	console.error(error.stack);
}

const DBLogger = {
  action: (action, params) => {
  	if(config.env == 'prod' || config.env == 'production')
  		return
    console.log(`Received action: ${action} with params: `, params);
  },
  response: (action, data) => {
  	if(config.env == 'prod' || config.env == 'production')
  		return
    console.log(`Response from action: ${action}: `, data);
  }
}

export {
	logger,
	DBLogger
}