import uuid from 'uuid/v4';
import database from '../database';
import { NotImplementedException } from '../../utils/exceptions';

/*
 * Class representing a BaseModel. 
 * BaseModel is the parent class of all our Model classes.
 */
class BaseModel {
	/**
     * Create a BaseModel instance. 
     * You will never have to call this directly but from a child class constructor.
     * If no id is provided it will generate a new one for the resulting instance.
     * @param {Object} id - The instance id in the database.
     */
	constructor(id) {
		this.id = id || uuid();
	}

	/**
     * Get the object with the respective id from the database.
     * @param {Object} id 
     * @param {Object} [args={}] optional query parameters.
     * @return {Promise<BaseModel>} A promise that resolve into an 
     * object from the child class.
     */
	static get(id, args={}) {
	    var params = Object.assign({}, {
	      TableName: this.getTableName(),
	      Key: {
	        id: id
	      }
	    }, args);

	    const self = this;
	    return database.get(params).then(data => {
		    return self.deserialize(data['Item']);
		});
	}

	/**
     * Get a batch of objects with the specified ids.
     * @param {Object[]} keys The keys to fetch from the database 
     * @param {Object} [args={}] optional query parameters.
     * @return {Promise<BaseModel[]>} A promise that resolve 
     * into an array of objects from the child class.
     */
	static getBatch(keys, args={}) {
		
		var params = {};
		params['RequestItems'] = {};
		params['RequestItems'][this.getTableName()] = Object.assign({}, {
			Keys: keys,
		}, args);


		const self = this;
	    return database.batchGet(params).then(data => {
	    	const items = data['Responses'][self.getTableName()];
		    const result = [];
		    for(var index in items) {
		    	result.push(self.deserialize(items[index]));
		    }
		    return result;
		});
	}

	/**
     * Query the database with the given arguments.
     * @param {Object} args optional query parameters.
     * @return {Promise<BaseModel[]>} A promise that resolve 
     * into an array of objects from the child class.
     */
	static query(args={}) {
		var params = Object.assign({}, {
	      TableName: this.getTableName(),
	    }, args);

		const self = this;
	    return database.query(params).then(data => {
		    const result = [];
		    const items = data.Items;
		    for(var index in items) {
		    	result.push(self.deserialize(items[index]));
		    }
		    return result;
		});
	}

	/**
     * Add the given item to the child class table.
     * @param {Object} item optional query parameters.
     * @param {Object} args={} query parameters.
     * @return {Promise} A promise that resolve into the db response.
     */
	static add(item, args={}) {

	  var params = Object.assign({}, {
	    TableName: this.tableName,
	    Item: item
	  }, args);

	  return database.put(params);
	}

	/**
     * Update the item with the specified Id from the child class table.
     * @param {Object} id the item id to update.
     * @param {Object} args={} query parameters.
     * @return {Promise<BaseModel>} A promise that resolve 
     * into an instance of the child class.
     */
	static update(id, args={}) {

		var params = {
	      TableName: this.getTableName(),
	      Key: {
	        id: id
	      },
	      ...args
	    };

	    const self = this;
	    return database.update(params).then(data => {
          const updatedUser = self.deserialize(data.Attributes);
          return updatedUser;
        });
	}

	/**
	 * Gets the child class table name in the database.  
	 * You are requiered to override this function on the child class.
     * @return {string} The name of the child class table in the database.
     */
	static getTableName() {
		throw new NotImplementedException();
	}

	/**
	 * Gets the list of fields that map to the table attributes of the 
	 * child class.
	 * You are requiered to override this function on the child class.
     * @return {string[]} The list of field names.
     */
	static getFields() {
		throw new NotImplementedException();
	}

	/**
	 * Converts from a database object to a child class object.
     * @return {BaseModel} the child class object.
     */
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