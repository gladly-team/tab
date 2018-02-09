/* eslint-env jest */

describe('getRecruits', () => {
  test('getTotalRecruitsCount works as expected', async () => {
    const getTotalRecruitsCount = require('../getRecruits').getTotalRecruitsCount
    const recruitsEdgesTestA = [
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-05-19T13:59:46.000Z',
          activeForAtLeastOneDay: true
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-02-07T13:59:46.000Z',
          activeForAtLeastOneDay: false
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-02-07T17:69:46.000Z',
          activeForAtLeastOneDay: false
        }
      }
    ]
    expect(getTotalRecruitsCount(recruitsEdgesTestA)).toBe(3)

    const recruitsEdgesTestB = [
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-05-19T13:59:46.000Z',
          activeForAtLeastOneDay: true
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-02-07T13:59:46.000Z',
          activeForAtLeastOneDay: true
        }
      }
    ]
    expect(getTotalRecruitsCount(recruitsEdgesTestB)).toBe(2)

    const recruitsEdgesTestC = []
    expect(getTotalRecruitsCount(recruitsEdgesTestC)).toBe(0)

    expect(getTotalRecruitsCount(null)).toBe(0)
  })

  test('getRecruitsActiveForAtLeastOneDay works as expected', async () => {
    const getRecruitsActiveForAtLeastOneDay = require('../getRecruits')
      .getRecruitsActiveForAtLeastOneDay
    const recruitsEdgesTestA = [
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-05-19T13:59:46.000Z',
          activeForAtLeastOneDay: true
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-02-07T13:59:46.000Z',
          activeForAtLeastOneDay: false
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-02-07T17:69:46.000Z',
          activeForAtLeastOneDay: false
        }
      }
    ]
    expect(getRecruitsActiveForAtLeastOneDay(recruitsEdgesTestA)).toBe(1)

    const recruitsEdgesTestB = [
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-05-19T13:59:46.000Z',
          activeForAtLeastOneDay: true
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-02-07T13:59:46.000Z',
          activeForAtLeastOneDay: true
        }
      }
    ]
    expect(getRecruitsActiveForAtLeastOneDay(recruitsEdgesTestB)).toBe(2)

    const recruitsEdgesTestC = []
    expect(getRecruitsActiveForAtLeastOneDay(recruitsEdgesTestC)).toBe(0)

    expect(getRecruitsActiveForAtLeastOneDay(null)).toBe(0)
  })
})
