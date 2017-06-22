/* global jest describe it expect test afterEach beforeEach */
beforeEach(() => {
  jest.resetModules()
})

afterEach(() => {
  delete process.env.TABLE_NAME_APPENDIX
})

describe('the tablesName module', () => {
  it('returns expected names', () => {
    process.env.TABLE_NAME_APPENDIX = ''
    const tableNames = require('../tables').default
    expect(tableNames.widgets).toBe('Widgets')
    expect(tableNames.userLevels).toBe('UserLevels')
  })

  test('uses custom table names appendix when set in config', () => {
    process.env.TABLE_NAME_APPENDIX = '-dev'
    const tableNames = require('../tables').default
    expect(tableNames.widgets).toBe('Widgets-dev')
    expect(tableNames.userLevels).toBe('UserLevels-dev')
  })

  test('uses no table name appendix when the config value is not in config', () => {
    const tableNames = require('../tables').default
    expect(tableNames.widgets).toBe('Widgets')
    expect(tableNames.userLevels).toBe('UserLevels')
  })
})
