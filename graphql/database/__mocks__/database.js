class DatabaseMock {
	constructor() {
		this.store = {};
	}

	init() {
		this.store = {};
	}

	setMockDataFor(operationType, resolver) {
		this.store[operationType] = resolver;
	}

	put() {
		var response = {};

		if(this.store.hasOwnProperty(DatabaseMock.PUT)) {
			response = this.store[DatabaseMock.PUT](params);
		}

		return Promise.resolve(response);
	}

	get(params) {
		var response = {};

		if(this.store.hasOwnProperty(DatabaseMock.GET)) {
			response = this.store[DatabaseMock.GET](params);
		}

		return Promise.resolve(response);
	}

	scan() {
		var response = {};

		if(this.store.hasOwnProperty(DatabaseMock.SCAN)) {
			response = this.store[DatabaseMock.SCAN](params);
		}

		return Promise.resolve(response);
	}

	update(params) {
		var response = {};

		if(this.store.hasOwnProperty(DatabaseMock.UPDATE)) {
			response = this.store[DatabaseMock.UPDATE](params);
		}

		return Promise.resolve(response);
	}
}

var Singleton = (function () {
    var mockDatabase;
 
    function createDatabase() {
        var database = new DatabaseMock();
        return database;
    }
 
    return {
        getDatabase: function () {
            if (!mockDatabase) {
                mockDatabase = createDatabase();
            }
            return mockDatabase;
        }
    };
})();

module.exports = Singleton.getDatabase();
