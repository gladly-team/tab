import tablesNames from '../tables';

// Import your mock data.
import features from './fixtures/features';

var database = {};

database.put = function(params) {
	switch(params.TableName) {
	  	case tablesNames.features:
	  		return Promise.resolve(params.Item);
	  	default:
	  		return Promise.reject();
	}
};

database.get = function(params) {
	switch(params.TableName) {
	  	case tablesNames.features:{
	  		if (params.Key.id == features[0].id) {
				return Promise.resolve(features[0]);
			}
			if (params.Key.id == features[1].id) {
				return Promise.resolve(features[1]);
			}
			return Promise.reject();
	  	}
	  	default:
	  		return Promise.reject();
	}
};

database.scan = function(params) {
  switch(params.TableName) {
  	case tablesNames.features:
  		return Promise.resolve({
	      Items: features
	    });
  	default:
  		return Promise.reject();
  }
};

module.exports = database;