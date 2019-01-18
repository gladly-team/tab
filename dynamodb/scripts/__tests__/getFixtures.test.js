/* eslint-env jest */

import getFixtures from "../getFixtures";

afterEach(() => {
  delete process.env.DB_TABLE_NAME_APPENDIX;
});

describe("getting fixtures info", () => {
  it("returns expected names", () => {
    process.env.DB_TABLE_NAME_APPENDIX = "";
    const fixtureInfo = getFixtures();
    expect(fixtureInfo[0].tableName).toBe("Users");
    expect(fixtureInfo[1].tableName).toBe("Charities");
  });

  test("uses an appendix on table names when it is set", () => {
    process.env.DB_TABLE_NAME_APPENDIX = "-dev";
    const fixtureInfo = getFixtures();
    expect(fixtureInfo[0].tableName).toBe("Users-dev");
    expect(fixtureInfo[1].tableName).toBe("Charities-dev");
  });

  test("uses no table name appendix when the config value is not in config", () => {
    const fixtureInfo = getFixtures();
    expect(fixtureInfo[0].tableName).toBe("Users");
    expect(fixtureInfo[1].tableName).toBe("Charities");
  });
});
