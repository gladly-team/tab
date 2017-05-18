jest.mock('../../config');

beforeEach(() => {
  jest.resetModules();
});

describe('the tablesName module', () => {

  it('returns expected names', () => {
    jest.mock('../../config', () => {
      return {
        TABLE_NAME_APPENDIX: '',
      }
    });
    const tableNames = require('../tables').default;
    expect(tableNames.widgets).toBe('Widgets');
    expect(tableNames.userLevels).toBe('UserLevels');
  });

  test('uses custom table names appendix when set in config', () => {
    jest.mock('../../config', () => {
      return {
        TABLE_NAME_APPENDIX: '-dev',
      }
    });
    const tableNames = require('../tables').default;
    expect(tableNames.widgets).toBe('Widgets-dev');
    expect(tableNames.userLevels).toBe('UserLevels-dev');
  });

  test('uses no table name appendix when the config value is not in config', () => {
    jest.mock('../../config', () => {
      return {}
    });
    const tableNames = require('../tables').default;
    expect(tableNames.widgets).toBe('Widgets');
    expect(tableNames.userLevels).toBe('UserLevels');
  });

})

