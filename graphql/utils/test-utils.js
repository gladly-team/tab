
// TODO: delete this file after migrating models

class DatabaseOperation {
  constructor (operation, resolver) {
    this.operation = operation
    this.resolver = resolver
  }
}

const OperationType = {}
OperationType.PUT = 'put'
OperationType.GET = 'get'
OperationType.BATCHGET = 'batch-get'
OperationType.QUERY = 'query'
OperationType.SCAN = 'scan'
OperationType.UPDATE = 'update'

export {
    DatabaseOperation,
    OperationType
}
