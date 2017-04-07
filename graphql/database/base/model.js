const uuid = require('uuid/v4');
const db = require('../database');

import {NotImplementedException} from '../../utils/exceptions';

class BaseModel {
	constructor(id) {
		this.id = id || uuid();
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

	// Override in child class to get the list of fields that map to DB.
	static getFields() {
		throw new NotImplementedException();
	}

	// Gets a database object and returns a model object.
	static deserialize(obj){
		const cls = this;
		const instance = new cls(
	  		obj.id);

		var field = '';
		const fields = this.getFields();
		for (var index in fields) {
			field = fields[index];
			instance[field] = obj[field] || instance[field];
		}
  		return instance;
	}

}

export default BaseModel;