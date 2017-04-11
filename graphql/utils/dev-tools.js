const logger = {};

logger.error = function(msg, error) {
	console.error(msg, error);
	console.error(error.stack);
}

export {
	logger,
}