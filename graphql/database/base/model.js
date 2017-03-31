const uuid = require('uuid/v4');
const db = require('../database');

import {NotImplementedException} from '../../utils/exceptions';

class BaseModel {
	constructor(id, table) {
		this.id = id || uuid();
		this.tableName = table;
	}

	static get(id, args={}) {
	 	
	    var params = Object.assign({}, {
	      TableName: this.getTableName(),
	      Key: {
	        id: id
	      }
	    }, args);

	    const self = this;
	    return db.get(params).then(data => {
		    return self.deserialize(data['Item']);
		});
	}

	static add(item, args={}) {

	  var params = Object.assign({}, {
	    TableName: this.tableName,
	    Item: item
	  }, args);

	  return db.put(params);
	}

	static update(id, args={}) {

		var params = {
	      TableName: this.getTableName(),
	      Key: {
	        id: id
	      },
	      ...args
	    };

	    return db.update(params);
	}

	// Override in child class to get the table name.
	static getTableName() {
		throw new NotImplementedException();
	}

	// Override in child class. 
	// Gets a database object and returns a model object.
	static deserialize(obj){
		throw new NotImplementedException();
	}

}

export default BaseModel;