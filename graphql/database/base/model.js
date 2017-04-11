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

	static getBatch(keys, args={}) {
		
		var params = {};
		params['RequestItems'] = {};
		params['RequestItems'][this.getTableName()] = Object.assign({}, {
			Keys: keys,
		}, args);


		const self = this;
	    return db.batchGet(params).then(data => {
	    	const items = data['Responses'][self.getTableName()];
		    const result = [];
		    for(var index in items) {
		    	result.push(self.deserialize(items[index]));
		    }
		    return result;
		});
	}

	static query(args={}) {
		var params = Object.assign({}, {
	      TableName: this.getTableName(),
	    }, args);

		const self = this;
	    return db.query(params).then(data => {
		    const result = [];
		    const items = data.Items;
		    for(var index in items) {
		    	result.push(self.deserialize(items[index]));
		    }
		    return result;
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

	    const self = this;
	    return db.update(params).then(data => {
          const updatedUser = self.deserialize(data.Attributes);
          return updatedUser;
        });
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
		var defaultValue;
		var value;
		for (var index in fields) {
			field = fields[index];
			value = obj[field];
			defaultValue = instance[field];

			if(!obj.hasOwnProperty(field)){
				instance[field] = defaultValue;
			}
			else if(value === parseInt(value, 10)){
				instance[field] = value;
			} else {
				instance[field] = obj[field] || instance[field];
			}
		}
  		return instance;
	}

}

export default BaseModel;